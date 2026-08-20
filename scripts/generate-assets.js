import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, "../src/assets");
const OUTPUT_FILE = path.join(__dirname, "../src/assets/assets.ts");

function walk(dir) {
  let results = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });

  return results;
}

// ❌ تجاهل الملفات غير المرغوبة
function isValidAsset(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // نرفض TypeScript + كود
  if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) return false;

  // نسمح فقط بالصور و svg
  if ([".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"].includes(ext))
    return true;

  return false;
}

function toKey(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let base = path
    .basename(filePath)
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();

  if (ext === ".svg") {
    return base + "Icon";
  } else {
    return base + "Image";
  }
}

function toImportPath(filePath) {
  const rel = filePath.split("src")[1].replace(/\\/g, "/");
  return ".." + rel;
}

const files = walk(ASSETS_DIR).filter(isValidAsset);

let imports = "";
let body = "export class Assets {\n";

files.forEach((file) => {
  const key = toKey(file);
  const importPath = toImportPath(file);

  imports += `import ${key} from "${importPath}";\n`;
  body += `  static ${key} = ${key};\n`;
});

body += "}\n";

const output = `// AUTO GENERATED FILE - DO NOT EDIT\n\n${imports}\n${body}`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log("✅ Assets generated (filtered assets only)");
