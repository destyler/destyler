import antfu from '@antfu/eslint-config'
import vitest from '@vitest/eslint-plugin'

export default antfu({
  test: true,
  rules: {
    'vue/no-template-shadow': 'off',
    'ts/no-empty-object-type': 'off',
    'jsdoc/empty-tags': 'off',
    'ts/no-misused-new': 'off',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    'no-cond-assign': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'vue/no-reserved-component-names': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'no-irregular-whitespace': 'off',
  },
  ignores: [
    '.specstory/**',
  ],
}, {
  files: ['test/**'],
  rules: {
    ...vitest.configs.recommended.rules,
    'vitest/max-nested-describe': ['error', { max: 3 }],
  },
})
