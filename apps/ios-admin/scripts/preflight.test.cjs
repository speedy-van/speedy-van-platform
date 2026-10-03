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
  assert.match(result.stdout, /build=49/);
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

test("visitor measurement is mounted behind the existing consent policy", () => {
  const globalProviders = fs.readFileSync(path.join(repoRoot, "apps/web/src/components/layout/GlobalProviders.tsx"), "utf8");
  const tracker = fs.readFileSync(path.join(repoRoot, "apps/web/src/components/tracking/VisitorTracker.tsx"), "utf8");

  assert.match(globalProviders, /<VisitorTracker\s*\/>/);
  assert.match(tracker, /useCookieConsent/);
  assert.match(tracker, /isPublicAnalyticsPath/);
  assert.match(tracker, /sv-visitor-session/);
});

test("ios visitors use one provider and are not registered as a hidden tab", () => {
  const rootLayout = fs.readFileSync(path.join(appRoot, "app/_layout.tsx"), "utf8");
  const tabsLayout = fs.readFileSync(path.join(appRoot, "app/(tabs)/_layout.tsx"), "utf8");
  const useVisitors = fs.readFileSync(path.join(appRoot, "src/hooks/useVisitors.ts"), "utf8");

  assert.match(rootLayout, /<VisitorsProvider>/);
  assert.match(rootLayout, /<Stack\.Screen name="visitors"/);
  assert.doesNotMatch(tabsLayout, /name="visitors"/);
  assert.match(useVisitors, /visitors\/VisitorsProvider/);
  assert.ok(fs.existsSync(path.join(appRoot, "app/visitors.tsx")));
});

test("ios visitor header counter animates with reduce-motion support", () => {
  const animatedCount = fs.readFileSync(path.join(appRoot, "src/components/AnimatedVisitorCount.tsx"), "utf8");
  const headerCounter = fs.readFileSync(path.join(appRoot, "src/components/VisitorHeaderCounter.tsx"), "utf8");

  assert.match(animatedCount, /Animated\.Value/);
  assert.match(animatedCount, /reduceMotionChanged/);
  assert.match(animatedCount, /tabular-nums/);
  assert.match(headerCounter, /useVisitors/);
  assert.match(headerCounter, /router\.push\("\/visitors"\)/);
});

test("ios-admin-clean refuses production EAS builds", () => {
  const result = runNode(path.join(cleanRoot, "scripts/reject-production-build.cjs"), cleanRoot);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Refusing EAS production build/);
});
