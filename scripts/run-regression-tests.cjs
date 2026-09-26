const { readdirSync } = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const scriptsDir = path.join(root, "scripts");
const files = readdirSync(scriptsDir)
  .filter((file) => /-regression\.cjs$/.test(file))
  .sort()
  .map((file) => path.join("scripts", file));

if (files.length === 0) {
  console.error("No regression tests found.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...files], {
  cwd: root,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? (result.signal ? 1 : 0));
