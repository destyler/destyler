import { defineBuildConfig } from 'unbuild'
import { entries, externals } from '../../../build.basic.config'

export default defineBuildConfig({
  entries: [
    ...entries,
  ],
  externals: [
    ...externals,
    '@vue/runtime-core',
    '@vue/reactivity',
    '@vue/shared'
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})