/* Build an isolated API upload from current source, never the tracked legacy bundle. */
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { bundleApiSources } = require("./bundle-source.cjs");

const apiRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(apiRoot, "../..");
const outputRoot = path.join(apiRoot, "dist");

async function buildStandalone({ outputDirectory = path.join(outputRoot, "standalone"), generateLock = true } = {}) {
  const relativeOutput = path.relative(outputRoot, outputDirectory);
  if (!relativeOutput || relativeOutput.startsWith("..") || path.isAbsolute(relativeOutput)) {
    throw new Error("Standalone output must be a child directory of apps/api/dist.");
  }
  const packageJson = JSON.parse(await fs.readFile(path.join(apiRoot, "package.json"), "utf8"));
  const lock = JSON.parse(await fs.readFile(path.join(repoRoot, "package-lock.json"), "utf8"));
  // Pin the direct runtime versions already verified in the repository lock.
  const dependencies = {};
  for (const name of [...Object.keys(packageJson.dependencies), "prisma"]) {
    const entry = lock.packages[`apps/api/node_modules/${name}`] || lock.packages[`node_modules/${name}`];
    if (!entry?.version) throw new Error(`No locked API runtime version found for ${name}.`);
    dependencies[name] = entry.version;
  }

  await bundleApiSources({ outputDirectory, includeServer: true });
  await fs.mkdir(path.join(outputDirectory, "prisma"), { recursive: true });

  const standalonePackage = {
    name: packageJson.name,
    version: packageJson.version,
    private: true,
    engines: { node: "24.x" },
    scripts: {
      start: "node index.js",
      postinstall: "prisma generate --schema=./prisma/schema.prisma",
      "vercel-build": "prisma generate --schema=./prisma/schema.prisma",
    },
    dependencies,
  };
  const deploymentConfig = {
    version: 2,
    installCommand: "npm ci --include=dev",
    builds: [{ src: "handler.js", use: "@vercel/node@13.0.2", config: {
      includeFiles: ["node_modules/@prisma/client/**", "node_modules/.prisma/client/**"],
    } }],
    routes: [{ src: "/(.*)", dest: "handler.js" }],
  };
  await fs.writeFile(path.join(outputDirectory, "package.json"), `${JSON.stringify(standalonePackage, null, 2)}\n`);
  await fs.writeFile(path.join(outputDirectory, "vercel.json"), `${JSON.stringify(deploymentConfig, null, 2)}\n`);
  await fs.copyFile(path.join(apiRoot, "prisma/schema.prisma"), path.join(outputDirectory, "prisma/schema.prisma"));

  if (generateLock) {
    // Produce an immutable install plan for this standalone artefact. Ignore all
    // lifecycle scripts here: packaging must not use database or payment secrets.
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const install = spawnSync(npm, ["install", "--package-lock-only", "--ignore-scripts", "--workspaces=false", "--no-audit", "--no-fund"], {
      cwd: outputDirectory,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (install.error || install.status !== 0) throw new Error("Could not lock standalone runtime dependencies.");
  }
  return outputDirectory;
}

module.exports = { buildStandalone };

if (require.main === module) {
  buildStandalone().then((output) => {
    console.log(`Standalone API built from current source: ${output}`);
    console.log("No deployment was performed. Use the existing API project when deploying this directory.");
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
