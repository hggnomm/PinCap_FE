module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: { version: "18.2" },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  plugins: ["react-refresh", "@typescript-eslint", "import", "unused-imports"],
  rules: {
    "react-refresh/only-export-components": "warn",

    // Import sorting and organization
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Node built-in modules
          "external", // npm packages
          "internal", // Internal modules (using @/ alias)
          "parent", // Parent directory imports
          ["sibling", "index"], // Same directory imports
          "type", // Type imports
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "react**",
            group: "external",
            position: "before",
          },
          {
            pattern: "react-**",
            group: "external",
            position: "before",
          },
          {
            pattern: "@ant-design/**",
            group: "external",
            position: "after",
          },
          {
            pattern: "antd/**",
            group: "external",
            position: "after",
          },
          {
            pattern: "antd",
            group: "external",
            position: "after",
          },
          {
            pattern: "@/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "./**/*.{css,less,scss,sass}",
            group: "sibling",
            position: "after",
          },
          {
            pattern: "**/*.{css,less,scss,sass}",
            group: "sibling",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "builtin"],
        warnOnUnassignedImports: false,
      },
    ],

    // Remove unused imports
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // Import validation
    "import/no-unresolved": "error",
    "import/no-duplicates": "error",
    "import/no-unused-modules": "warn",

    // TypeScript specific
    "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
  },
};
