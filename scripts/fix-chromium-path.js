const fs = require("fs");
const path = require("path");

const nextNodeModules = path.join(__dirname, "..", ".next", "node_modules");
const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "@sparticuz",
  "chromium",
);

if (!fs.existsSync(nextNodeModules)) {
  console.log("No .next/node_modules found");
  process.exit(0);
}

const dirs = fs.readdirSync(path.join(nextNodeModules, "@sparticuz"));
const chromiumDir = dirs.find((d) => d.startsWith("chromium"));

if (!chromiumDir) {
  console.log("Chromium not found in .next");
  process.exit(0);
}

console.log(nextNodeModules);
console.log(chromiumDir);

const source = path.join(nextNodeModules, "@sparticuz", chromiumDir);

fs.mkdirSync(path.dirname(target), { recursive: true });

// Copy instead of symlink (Vercel safer)
fs.cpSync(source, target, { recursive: true });

console.log("✅ Chromium path fixed");
