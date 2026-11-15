import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      // setMounted(true) in useEffect is the standard Next.js hydration pattern
      "react-hooks/set-state-in-effect": "off",
    }
  },
  {
    // CJS config files and compatibility shims are allowed to use require()
    files: ["jest.config.js", "playwright.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    }
  }
];

export default eslintConfig;
