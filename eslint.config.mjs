import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Configuración base de ESLint
  eslint.configs.recommended,
  
  // Configuración para TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      // Reglas específicas para TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "error",
      
      // Reglas personalizadas
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    }
  },
  
  // Configuración de Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Reglas adicionales
  {
    rules: {
      // Reglas que necesitas relajar temporalmente
      "no-var": "off",
      
      // Mejores prácticas
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "warn",
      "import/no-anonymous-default-export": "off",
      
      // Reglas de formato (puedes usar Prettier para esto)
      "max-len": ["warn", { "code": 120, "ignoreComments": true }],
      "quotes": ["warn", "single", { "avoidEscape": true }],
    }
  },
  
  // Configuración específica para archivos de API
  {
    files: ["src/app/api/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  
  // Configuración para archivos de componentes
  {
    files: ["src/components/**/*.tsx"],
    rules: {
      "react/prop-types": "off"
    }
  }
];