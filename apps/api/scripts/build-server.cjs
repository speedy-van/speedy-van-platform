/* Compile API and workspace TypeScript together; never deploy the legacy _api.js. */
const path = require("node:path");
const { bundleApiSources } = require("./bundle-source.cjs");

function buildServer({ outputDirectory = path.resolve(__dirname, "../dist/vercel") } = {}) {
  return bundleApiSources({ outputDirectory, extension: ".cjs" });
}

module.exports = { buildServer };

if (require.main === module) {
  buildServer().then((output) => {
    console.log(`Vercel API handler built from current source: ${output}`);
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
