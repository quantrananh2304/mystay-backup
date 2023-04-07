module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:nuxt/base',
    '@nuxtjs',
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  // add your custom rules here
  rules: {
    'space-before-function-paren': ['error', 'never'],
    camelcase: 'off'
  }
}
