const { build } = require("esbuild");
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");

const apiRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(apiRoot, "../..");
const outputRoot = path.join(apiRoot, "dist");

async function bundleApiSources({ outputDirectory, includeServer = false, extension = ".js" }) {
  const relativeOutput = path.relative(outputRoot, outputDirectory);
  if (!relativeOutput || relativeOutput.startsWith("..") || path.isAbsolute(relativeOutput)) {
    throw new Error("API build output must be a child directory of apps/api/dist.");
  }
  const packageJson = JSON.parse(await fs.readFile(path.join(apiRoot, "package.json"), "utf8"));
  const aliases = Object.fromEntries(["config", "db", "shared"].map((name) => [
    `@speedy-van/${name}`, path.join(repoRoot, "packages", name, "src/index.ts"),
  ]));
  for (const entry of Object.values(aliases)) await fs.access(entry);

  await fs.rm(outputDirectory, { recursive: true, force: true });
  await fs.mkdir(outputDirectory, { recursive: true });
  const result = await build({
    absWorkingDir: apiRoot,
    entryPoints: includeServer ? { handler: "src/handler.ts", index: "src/index.ts" } : { handler: "src/handler.ts" },
    outdir: outputDirectory,
    outExtension: { ".js": extension },
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    alias: aliases,
    external: [...Object.keys(packageJson.dependencies), "pusher"],
    metafile: true,
    logLevel: "warning",
  });

  const sources = {};
  for (const input of Object.keys(result.metafile.inputs).sort()) {
    const filename = path.resolve(apiRoot, input);
    sources[path.relative(repoRoot, filename).split(path.sep).join("/")] = createHash("sha256")
      .update(await fs.readFile(filename)).digest("hex");
  }
  await fs.writeFile(path.join(outputDirectory, "source-manifest.json"), `${JSON.stringify({ sources }, null, 2)}\n`);
  return outputDirectory;
}

module.exports = { bundleApiSources };
