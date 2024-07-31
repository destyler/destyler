import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'examples/**',
    '**/demos/**',
    '**/.story/**',
    '**/qrcodegen.ts',
    '**/__test__/**.spec.vue',
  ],
})
