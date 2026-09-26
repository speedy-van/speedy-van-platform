// @ts-check
"use strict";

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Parse a .env / .env.local file and return key-value pairs.
 * Handles quoted values, inline comments, and blank lines.
 */
function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const vars = {};
    for (const raw of content.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key) vars[key] = val;
    }
    return vars;
  } catch {
    return {};
  }
}

const root = path.join(__dirname, "..");

const CYAN   = "\x1b[36m";
const INDIGO = "\x1b[35m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

function prefixLines(name, color, data) {
  String(data).split(/\r?\n/).filter(Boolean).forEach((line) => {
    process.stdout.write(`${color}${BOLD}[${name}]${RESET} ${line}\n`);
  });
}

function startProcess(name, color, command, args, cwd, extraEnv = {}) {
  const pathKey = Object.keys(process.env).find((key) => key.toLowerCase() === "path") || "Path";
  const childPath = [
    path.join(cwd, "node_modules", ".bin"),
    path.join(root, "node_modules", ".bin"),
    process.env[pathKey] || "",
  ].join(path.delimiter);
  const proc = spawn(command, args, {
    cwd,
    env: { ...process.env, [pathKey]: childPath, ...extraEnv },
    windowsHide: true,
  });
  proc.stdout.on("data", (d) => prefixLines(name, color, d));
  proc.stderr.on("data", (d) => prefixLines(name, color, d));
  proc.on("exit", (code) => {
    console.log(`${color}[${name}]${RESET} exited with code ${code}`);
    if (name === "web" && code && code !== 0) process.exit(code);
  });
  return proc;
}

console.log(`${BOLD}Starting SpeedyVan dev servers...${RESET}`);
console.log(`  ${CYAN}web${RESET}  → http://localhost:3002`);
console.log(`  ${INDIGO}api${RESET}  → http://localhost:4000\n`);

// Load .env.local files for each app so vars are injected directly into the
// child process environment — no dependency on dotenv-cli being in PATH.
const webEnv = loadEnvFile(path.join(root, "apps", "web", ".env.local"));
const apiEnv = loadEnvFile(path.join(root, "apps", "api", ".env.local"));
const webCli = path.join(root, "apps", "web", "node_modules", "next", "dist", "bin", "next");
const apiCli = path.join(root, "apps", "api", "node_modules", "tsx", "dist", "cli.mjs");

const webProc = startProcess(
  "web", CYAN,
  process.execPath,
  [webCli, "dev", "-p", "3002"],
  path.join(root, "apps", "web"),
  webEnv
);

const apiProc = startProcess(
  "api", INDIGO,
  process.execPath,
  [apiCli, "watch", "src/index.ts"],
  path.join(root, "apps", "api"),
  apiEnv
);

function shutdown() {
  webProc.kill("SIGTERM");
  apiProc.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

