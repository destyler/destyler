import { defineBuildConfig } from 'unbuild'
import { buildEndHook, entries,externals } from '../../build.basic.config'

export default defineBuildConfig({
  entries: [
    ...entries,
    'src/presets',
  ],
  externals: [
    ...externals,
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  hooks: {
    'build:done': buildEndHook,
  },
})
