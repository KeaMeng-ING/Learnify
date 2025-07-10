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
      "@typescript-eslint/no-unused-expressions": "off", // Completely disable
      "@typescript-eslint/no-unused-vars": "off", // Completely disable
      "@typescript-eslint/no-this-alias": "off", // Disable this-alias rule
      "@typescript-eslint/no-require-imports": "off", // Disable require imports rule
      "@typescript-eslint/no-explicit-any": "off", // Disable explicit any warnings
      "@typescript-eslint/no-empty-object-type": "off", // Disable empty object type warnings
      "@typescript-eslint/no-wrapper-object-types": "off", // Disable Object vs object warnings
      "@typescript-eslint/no-unnecessary-type-constraint": "off", // Disable unnecessary type constraint warnings
      "@typescript-eslint/no-unsafe-function-type": "off", // Disable Function type warnings
    },
  },
];

export default eslintConfig;
