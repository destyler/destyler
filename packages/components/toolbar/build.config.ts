import { defineBuildConfig } from 'unbuild'
import { entries, externals } from '../../../build.basic.config'

export default defineBuildConfig({
  entries: [
    ...entries,
  ],
  externals: [
    ...externals,
    '@vue/runtime-core',
    '@vue/reactivity'
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
