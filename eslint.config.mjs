import nextConfig from "eslint-config-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...nextConfig,

  ...tseslint.configs.recommended,

  {
    rules: {
      // 🚫 يمنع any
      "@typescript-eslint/no-explicit-any": "error",

      // 🔥 قواعد قوية
      "@typescript-eslint/no-unused-vars": "warn",
      // "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
];

export default eslintConfig;
