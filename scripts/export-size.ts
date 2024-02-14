import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { getExportsSize } from 'export-size'
import { filesize } from 'filesize'
import fs from 'fs-extra'

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

  const packages = [
    {
      path: 'components/arrow',
      external: [],
    },
    {
      path: 'components/aspectRadio',
      external: ['@vue/runtime-core'],
    },
    {
      path: 'components/backTop',
      external: ['@vue/runtime-core'],
    },
    {
      path: 'components/button',
      external: ['@vue/runtime-core'],
    },
    {
      path: 'components/checkbox',
      external: [],
    },
    {
      path: 'components/collapse',
      external: [],
    },
    {
      path: 'components/collapsible',
      external: [],
    },
    {
      path: 'components/contextMenu',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
        '@vue/shared',
      ],
    },
    {
      path: 'components/countdown',
      external: [],
    },
    {
      path: 'components/dialog',
      external: [],
    },
    {
      path: 'components/dismissableLayer',
      external: [],
    },
    {
      path: 'components/divider',
      external: [
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/dropdown',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
        '@vue/shared',
      ],
    },
    {
      path: 'components/focusScope',
      external: [],
    },
    {
      path: 'components/icon',
      external: [],
    },
    {
      path: 'components/image',
      external: [
        '@vue/reactivity',
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/image',
      external: [
        '@vue/reactivity',
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/info',
      external: [
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/label',
      external: [],
    },
    {
      path: 'components/link',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
      ],
    },
    {
      path: 'components/menu',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
      ],
    },
    {
      path: 'components/menubar',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
        '@vue/shared',
      ],
    },
    {
      path: 'components/modal',
      external: [
        '@vue/shared',
      ],
    },
    {
      path: 'components/online',
      external: [],
    },
    {
      path: 'components/popover',
      external: [
        '@vue/shared',
      ],
    },
    {
      path: 'components/popper',
      external: [],
    },
    {
      path: 'components/presence',
      external: [],
    },
    {
      path: 'components/preview',
      external: [
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/primitive',
      external: [],
    },
    {
      path: 'components/progress',
      external: [],
    },
    {
      path: 'components/radio',
      external: [],
    },
    {
      path: 'components/rovingFocus',
      external: [
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/scrollArea',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
      ],
    },
    {
      path: 'components/select',
      external: [
        '@vue/reactivity',
        'vue-demi',
        '@vue/shared',
      ],
    },
    {
      path: 'components/slider',
      external: [],
    },
    {
      path: 'components/switch',
      external: [
        '@vue/shared',
        '@vue/runtime-core',
      ],
    },
    {
      path: 'components/tabs',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
      ],
    },
    {
      path: 'components/teleport',
      external: [],
    },
    {
      path: 'components/toggle',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
      ],
    },
    {
      path: 'components/toolbar',
      external: [
        '@vue/runtime-core',
        '@vue/reactivity',
      ],
    },
    {
      path: 'components/tooltip',
      external: [
        '@vue/shared',
      ],
    },
    {
      path: 'components/visuallyHidden',
      external: [],
    },
    {
      path: 'composition',
      external: [],
    },
    {
      path: 'destyler',
      external: [],
    },
    {
      path: 'directives',
      external: [],
    },
    {
      path: 'shared',
      external: [],
    },
  ]

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
