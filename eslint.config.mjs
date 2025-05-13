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
      // Turn off both the general and TypeScript-specific unused-vars rules
      "no-unused-vars": "off", // Disable the base rule
      "@typescript-eslint/no-unused-vars": "off", // Disable TypeScript-specific rule
    },
  },
];

export default eslintConfig;
