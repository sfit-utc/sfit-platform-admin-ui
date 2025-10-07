import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable 'any' rule
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Ignore unused variables starting with '_'
      "react-hooks/rules-of-hooks": "error", // Ensure Hooks are used correctly
      "react-hooks/exhaustive-deps": "warn", // Warn about missing dependencies
      "@next/next/no-img-element": "warn", // Warn instead of error for <img>
    },
  },
];

export default eslintConfig;
