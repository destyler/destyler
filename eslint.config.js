import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'examples/**',
    '**/demos/**',
    '**/qrcodegen.ts',
  ],
})
