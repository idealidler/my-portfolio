import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.config({
    extends: ["next/core-web-vitals"],
    ignorePatterns: ["src/**", "api/**", "dist/**", "out/**", ".next/**"],
  }),
];

export default config;
