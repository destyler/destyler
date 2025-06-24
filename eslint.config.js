import antfu from '@antfu/eslint-config'

export default antfu({
}, {
  rules: {
    'vue/no-template-shadow': 'off',
    'ts/no-empty-object-type': 'off',
    'jsdoc/empty-tags': 'off',
    'ts/no-misused-new': 'off',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    'no-cond-assign': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'lit-plugin(no-invalid-tag-name)': 'off',
    'vue/no-reserved-component-names': 'off'
  },
})
