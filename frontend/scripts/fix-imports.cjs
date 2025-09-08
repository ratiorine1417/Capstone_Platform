// scripts/fix-imports.cjs
const fs = require("fs");
const path = require("path");

const UI_DIR = path.join(process.cwd(), "src", "components", "ui");
if (!fs.existsSync(UI_DIR)) {
  console.error("UI components directory not found:", UI_DIR);
  process.exit(1);
}

const files = fs.readdirSync(UI_DIR).filter(f => f.endsWith(".tsx"));

for (const f of files) {
  const p = path.join(UI_DIR, f);
  let s = fs.readFileSync(p, "utf8");

  // 1) @radix-ui/* 에 붙은 '@버전' 제거
  //    e.g. "@radix-ui/react-progress@1.1.2" -> "@radix-ui/react-progress"
  s = s.replace(/@radix-ui\/react-([a-z-]+)@[^"']+/g, '@radix-ui/react-$1');

  // 2) lucide-react, react-day-picker에도 혹시 버전 붙었으면 제거
  s = s.replace(/lucide-react@[^"']+/g, 'lucide-react');
  s = s.replace(/react-day-picker@[^"']+/g, 'react-day-picker');

  // 3) utils 경로 통일: "src/lib/utils" 혹은 "./utils" -> "@/lib/utils"
  s = s.replace(/from\s+["']src\/lib\/utils["']/g, 'from "@/lib/utils"');
  s = s.replace(/from\s+["']\.\/utils["']/g, 'from "@/lib/utils"');

  fs.writeFileSync(p, s, "utf8");
  console.log("fixed:", f);
}

console.log("✅ import normalization completed.");