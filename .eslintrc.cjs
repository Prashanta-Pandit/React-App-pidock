module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    quotes: ["error", "double"],
    "spaced-comment": ["error", "always"],
    "no-trailing-spaces": "error",
    indent: ["error", 2],
  },
};

