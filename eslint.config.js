import antfu, { GLOB_SRC, GLOB_VUE } from '@antfu/eslint-config'
import vitest from '@vitest/eslint-plugin'

export default antfu({
  pnpm: false,
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
}).overrides({
  // Keep the existing Vue script checks after Antfu scoped these presets to JS/TS.
  'antfu/jsdoc/rules': { files: [GLOB_SRC, GLOB_VUE] },
  'antfu/node/rules': { files: [GLOB_SRC, GLOB_VUE] },
  'antfu/unicorn/rules': { files: [GLOB_SRC, GLOB_VUE] },
})
