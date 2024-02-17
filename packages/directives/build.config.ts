import { defineBuildConfig } from 'unbuild'
import { buildEndHook } from '../../build.basic.config'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  externals: [
    'vue',
    'unplugin-vue-components',
    'unplugin-auto-import',
  ],
  clean: false,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  hooks: {
    'build:done': buildEndHook,
  },
})
