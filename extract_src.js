import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcFolder = path.resolve(__dirname, "src");
const outputFile = path.resolve(__dirname, "all-src-code.txt");

// Clear output file if it already exists
fs.writeFileSync(outputFile, "", "utf8");

function readDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      readDirectory(fullPath);
    } else {
      const relativePath = path.relative(srcFolder, fullPath);
      
      const content = fs.readFileSync(fullPath, "utf8");

      const fileData = `
============================================================
FILE: ${relativePath}
============================================================

${content}


`;

      fs.appendFileSync(outputFile, fileData, "utf8");
    }
  });
}

readDirectory(srcFolder);

console.log(`Done! All source code has been written to:
${outputFile}`);