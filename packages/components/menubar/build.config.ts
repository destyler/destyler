import { defineBuildConfig } from 'unbuild'
import { entries, externals } from '../../../build.basic.config'

export default defineBuildConfig({
  entries: [
    ...entries,
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
})
