/** @format */

module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint'],
    settings: {
        react: {
            pragma: 'React',
            version: 'detect',
        },
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: false,
    },
    rules: {
        '@typescript-eslint/no-this-alias': [
            'error',
            {
                allowDestructuring: true, // Allow `const { props, state } = this`; false by default
                allowedNames: ['_this'], // Allow `const vm= this`; `[]` by default
            },
        ],
    },
}
