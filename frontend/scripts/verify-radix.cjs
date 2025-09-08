// scripts/verify-radix.cjs
const pkgs = [
  "@radix-ui/react-slot",
  "@radix-ui/react-progress",
  "@radix-ui/react-avatar",
  "@radix-ui/react-tabs",
  "@radix-ui/react-tooltip",
  "@radix-ui/react-checkbox",
  "@radix-ui/react-radio-group",
  "@radix-ui/react-toggle",
  "lucide-react",
  "react-day-picker"
];

try {
  for (const p of pkgs) {
    require.resolve(p);
  }
  console.log("✅ Radix/shadcn deps resolved.");
  process.exit(0);
} catch (e) {
  console.error("❌ Dependency resolve failed:", e.message);
  process.exit(1);
}