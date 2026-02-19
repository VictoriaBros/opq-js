import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended"),
    ignores: ["eslint.config.mjs"],

    languageOptions: {
        globals: {
            module: true,
            require: true,
            exports: true,
            console: true,
            describe: true,
            test: true,
            expect: true,
            jest: true,
        },

        ecmaVersion: 10,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        semi: "error",

        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        quotes: ["error", "single"],
        curly: "error",
        "comma-dangle": ["error", "only-multiline"],
    },
}]);
