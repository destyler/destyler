import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: false,
  declaration: true,
  externals: [
    'vue',
  ],
  rollup: {
    emitCJS: true,
  },
})
