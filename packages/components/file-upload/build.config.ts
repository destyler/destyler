import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'index',
  ],
  externals: [
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
