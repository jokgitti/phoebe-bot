import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettier from "eslint-plugin-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default [
  {
    ignores: ["node_modules"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      "prettier/prettier": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
]
