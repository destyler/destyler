import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'examples/**',
    '**/demos/**',
    '**/.story/**',
    '**/__test__/**.spec.vue',
    '**/.docs/guide/**.md',
  ],

}, {
  rules: {
    'vue/no-template-shadow': 'off',
  },
})
