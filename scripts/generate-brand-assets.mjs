import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.join(root, "apps", "web");
const appDir = path.join(webRoot, "src", "app");
const publicDir = path.join(webRoot, "public");
const brandDir = path.join(publicDir, "brand");
const logoPath = path.join(publicDir, "logo.png");
const callIconPath = path.join(publicDir, "call-icon.png");
const webRequire = createRequire(path.join(webRoot, "package.json"));

let sharp;
try {
  sharp = webRequire("sharp");
} catch (error) {
  console.error("sharp is required to generate brand assets. Install it in apps/web and rerun this script.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

await fs.mkdir(brandDir, { recursive: true });

const resizePng = async (input, output, size) => {
  await sharp(input)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
};

await resizePng(logoPath, path.join(appDir, "icon.png"), 192);
await resizePng(logoPath, path.join(appDir, "apple-icon.png"), 180);
await resizePng(logoPath, path.join(brandDir, "logo-512.png"), 512);
await resizePng(callIconPath, path.join(publicDir, "call-icon-128.png"), 128);

const ogLogo = await sharp(logoPath)
  .resize(420, 420, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const ogSharePath = path.join(publicDir, "og-share.jpg");
await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: "#0A0A0A",
  },
})
  .composite([{ input: ogLogo, gravity: "center" }])
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(ogSharePath);

const { size } = await fs.stat(ogSharePath);
if (size > 300 * 1024) {
  console.error(`og-share.jpg is ${(size / 1024).toFixed(1)} KB, expected <= 300 KB.`);
  process.exit(1);
}

console.log(`Generated brand assets. og-share.jpg ${(size / 1024).toFixed(1)} KB.`);
