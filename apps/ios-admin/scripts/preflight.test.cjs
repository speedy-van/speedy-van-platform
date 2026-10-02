const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "../..");
const cleanRoot = path.join(repoRoot, "apps/ios-admin-clean");

function runNode(scriptPath, cwd) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    encoding: "utf8",
  });
}

test("ios-admin release preflight accepts the authoritative app root", () => {
  const result = runNode(path.join(appRoot, "scripts/preflight.cjs"), appRoot);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /root=apps\\ios-admin|root=apps\/ios-admin/);
  assert.match(result.stdout, /build=48/);
});

test("ios-admin release preflight keeps worklets out of manifest and lockfile", () => {
  const packageJson = fs.readFileSync(path.join(appRoot, "package.json"), "utf8");
  const lockfile = fs.readFileSync(path.join(repoRoot, "package-lock.json"), "utf8");

  assert.doesNotMatch(packageJson, /react-native-worklets/);
  assert.doesNotMatch(lockfile, /apps\/ios-admin\/node_modules\/react-native-worklets/);
  assert.doesNotMatch(lockfile, /"react-native-worklets": "0\.2\.0"/);
});

test("ios-admin pins query-string to the Expo Router compatible CommonJS API", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(appRoot, "package.json"), "utf8"));
  const lockfile = JSON.parse(fs.readFileSync(path.join(repoRoot, "package-lock.json"), "utf8"));
  const queryString = require(path.join(appRoot, "node_modules/query-string"));

  assert.equal(packageJson.dependencies["query-string"], "7.1.3");
  assert.equal(lockfile.packages["apps/ios-admin/node_modules/query-string"].version, "7.1.3");
  assert.equal(typeof queryString.stringify, "function");
});

test("ios-admin-clean refuses production EAS builds", () => {
  const result = runNode(path.join(cleanRoot, "scripts/reject-production-build.cjs"), cleanRoot);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Refusing EAS production build/);
});
