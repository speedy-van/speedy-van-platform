const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const tsx = path.join(root, "apps", "api", "node_modules", ".bin", process.platform === "win32" ? "tsx.cmd" : "tsx");

function runTypeScriptCheck(relativePath) {
  const result = spawnSync(tsx, [relativePath], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(
    result.status,
    0,
    [
      `${relativePath} failed`,
      result.stdout.trim(),
      result.stderr.trim(),
    ].filter(Boolean).join("\n"),
  );
}

test("booking service aliases keep intended draft identities", () => {
  runTypeScriptCheck("apps/web/src/lib/booking-service-options.test.ts");
});

test("van capacity accepts booking service aliases", () => {
  runTypeScriptCheck("packages/shared/src/van-capacity.test.ts");
});

