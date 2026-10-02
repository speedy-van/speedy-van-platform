const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "../..");
const appJsonPath = path.join(appRoot, "app.json");
const packageJsonPath = path.join(appRoot, "package.json");
const lockPath = path.join(repoRoot, "package-lock.json");

function fail(message) {
  console.error(`[ios-admin preflight] ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Cannot read valid JSON from ${path.relative(repoRoot, filePath)}: ${error.message}`);
  }
}

const appJson = readJson(appJsonPath).expo;
const packageJson = readJson(packageJsonPath);
const lockText = fs.existsSync(lockPath) ? fs.readFileSync(lockPath, "utf8") : "";
const lockJson = fs.existsSync(lockPath) ? readJson(lockPath) : null;

if (path.basename(appRoot) !== "ios-admin") {
  fail(`Wrong app root: ${appRoot}`);
}

if (appJson?.ios?.bundleIdentifier !== "co.uk.speedy-van.admin") {
  fail(`Wrong iOS bundle identifier: ${appJson?.ios?.bundleIdentifier ?? "missing"}`);
}

if (appJson?.extra?.eas?.projectId !== "37fb9ca1-cad4-4b02-b3d9-b79f67372bf0") {
  fail(`Wrong EAS project ID: ${appJson?.extra?.eas?.projectId ?? "missing"}`);
}

const buildNumber = Number(appJson?.ios?.buildNumber);
if (!Number.isInteger(buildNumber) || buildNumber <= 47) {
  fail(`iOS buildNumber must be the next unused value above 47; found ${appJson?.ios?.buildNumber ?? "missing"}`);
}

if (packageJson.dependencies?.["react-native-worklets"]) {
  fail("react-native-worklets must not be a dependency of the Expo SDK 52/Reanimated 3 admin app.");
}

if (packageJson.dependencies?.["query-string"] !== "7.1.3") {
  fail("query-string must be pinned to 7.1.3 so Expo Router can call queryString.stringify.");
}

if (lockText.includes('"apps/ios-admin/node_modules/react-native-worklets"') || lockText.includes('"react-native-worklets": "0.2.0"')) {
  fail("package-lock.json still contains react-native-worklets for apps/ios-admin.");
}

const resolvedQueryString = lockJson?.packages?.["apps/ios-admin/node_modules/query-string"];
if (resolvedQueryString?.version !== "7.1.3") {
  fail(`package-lock.json must resolve apps/ios-admin query-string to 7.1.3; found ${resolvedQueryString?.version ?? "missing"}.`);
}

const lockHash = fs.existsSync(lockPath)
  ? crypto.createHash("sha256").update(fs.readFileSync(lockPath)).digest("hex")
  : "missing";

console.log(`[ios-admin preflight] ok root=${path.relative(repoRoot, appRoot)} build=${buildNumber} lock=${lockHash.slice(0, 12)}`);
