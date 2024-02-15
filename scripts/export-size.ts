import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { getExportsSize } from 'export-size'
import { filesize } from 'filesize'
import fs from 'fs-extra'
import { componentsPackages, rootPackages } from '../meta/packages'

async function run() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // made shared library imported can resolve correctly
  const packagesRoot = resolve(__dirname, '..', 'packages')
  const mdJSON = <{ path: {
    name: string
    size: string
    version: string
  } }>{}

  const packages = [...rootPackages, ...componentsPackages]

  for (const pkg of packages) {
    const { exports } = await getExportsSize({
      pkg: `./packages/${pkg.path}/`,
      output: false,
      bundler: 'rollup',
      external: ['vue', 'unplugin-vue-components', 'unplugin-auto-import', ...(pkg.external || [])],
    })

    const data = await fs.readFile(`${packagesRoot}/${pkg.path}/package.json`, 'utf-8')

    exports.forEach((i) => {
      mdJSON[pkg.path] = {
        name: JSON.parse(data).name,
        size: filesize(i.bundled),
        version: JSON.parse(data).version,
      }
    })
  }
  await fs.writeJSON('docs/public/export-size.json', mdJSON, { spaces: 2 })
}

run()
