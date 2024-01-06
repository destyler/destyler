import { reactive, watch, watchEffect } from 'vue'

// import { parse } from '@vue/compiler-sfc'
import { createEventHook } from '@vueuse/core'
import lz from 'lz-string'
import { compileFile } from './compiler/sfcCompiler'

// const demos = import.meta.glob('../demos/**/*.(vue|json)')

const shouldUpdateContent = createEventHook()

export interface OrchestratorPackage {
  name: string
  description?: string
  version?: string
  url: string
  source?: string
}

export class OrchestratorFile {
  filename: string
  template: string
  script: string
  style: string

  compiled = {
    js: '',
    css: '',
    ssr: '',
  }

  constructor(filename: string, template: string | undefined, script: string | undefined, style?: string) {
    this.filename = filename
    this.template = template || ''
    this.script = script || ''
    this.style = style || ''
  }

  get code() {
    return `
      <script setup>
        ${this.script}
      </script>
      <template>
        ${this.template}
      </template>
      `
  }
}

export interface Orchestrator {
  files: {
    [key: string]: OrchestratorFile
  }
  packages: OrchestratorPackage[]
  activeFilename: string
  errors: (string | Error)[]
  runtimeErrors: (string | Error)[]

  readonly activeFile: OrchestratorFile | undefined
  readonly importMap: string
}

/**
 * Main app orchestrator, handles all the files, import maps, and errors
 */
export const orchestrator: Orchestrator = reactive({
  files: {
    'App.vue': new OrchestratorFile('App.vue', '', ''),
  },
  packages: [],
  activeFilename: 'App.vue',
  errors: [],
  runtimeErrors: [],

  get activeFile() {
    return orchestrator.files[this.activeFilename]
  },

  get importMap() {
    const imports = orchestrator.packages.map(({ name, url }) => `"${name}": "${url}"`)

    return `
      {
        "imports": {
          ${imports.join(',\n')}
        }
      }
    `
  },
})

/**
 * Setup Watchers
 */

watchEffect(() => {
  if (orchestrator.activeFile)
    compileFile(orchestrator.activeFile)
})

watch(() => orchestrator.activeFilename, () => {
  shouldUpdateContent.trigger(null)
})

export function exportState() {
  const files = Object.entries(orchestrator.files).reduce((acc, [name, { template, script }]) => {
    acc[name] = { template, script }
    return acc
  }, {})

  return lz.compressToEncodedURIComponent(JSON.stringify({
    packages: orchestrator.packages,
    files,
  }))
}

/**
 * Add a file to the orchestrator
 *
 * @param file File content
 */
export function addFile(file: OrchestratorFile) {
  orchestrator.files = {
    ...orchestrator.files,
    [file.filename]: file,
  }

  compileFile(orchestrator.files[file.filename])
}

export function setActiveFile(name: string) {
  orchestrator.activeFilename = name
}

/**
 * Remove a file from the orchestrator
 *
 * @param name Name of file to remove
 */
export function removeFile(name: string) {
  delete orchestrator.files[name]
  setTimeout(() => setActiveFile('App.vue'), 0)
}

/**
 * Remove all files from the orchestrator
 */
export function removeAllFiles() {
  orchestrator.files = {}
}

/**
 * Load a demo folder
 *
 * @param name Name of demo to open
 */
// export async function openDemo(name: string) {
//   // Get all modules from demo
//   const modules = (await Promise.all(Object.entries(demos)
//     .filter(([path]) => path.split('demos/')[1].split('/')[0] === name)
//     .filter(([path]) => path.includes('.vue') || path.includes('.json'))
//     .map(async([path]) => ([path, (await import(`${path}?raw`)).default]))))

//   console.log(modules)

//   const packages = (await Promise.all(Object.entries(demos)
//     .filter(([path]) => path.split('demos/')[1].split('/')[0] === name)
//     .filter(([path]) => path.includes('.json'))
//     .map(async([path, imp]) => ([path, (await imp()).default]))))
//     .find(([path]) => path.includes('packages.json'))

//   if (packages)
//     orchestrator.packages = packages[1]

//   removeAllFiles()

//   // Load Vue Files
//   modules
//     .filter(([path]) => path.includes('.vue'))
//     .map(([path, content]) => {
//       const { descriptor: { template, scriptSetup } } = parse(content)
//       return {
//         filename: path.split(`${name}/`)[1],
//         script: scriptSetup?.content.trim(),
//         template: template?.content.trim(),
//       }
//     })
//     .forEach(({ filename, script, template }) => {
//       addFile(new OrchestratorFile(filename, template, script))
//     })

//   setActiveFile('App.vue')
//   shouldUpdateContent.trigger(null)
// }

export const onShouldUpdateContent = shouldUpdateContent.on

// openDemo('default')

// App.vue
const appTemplate = `
<DestylerTime :time="0" />
`
const appScript = `
import { DestylerTime } from '@destyler/time'
`

const initialPackages = [
  {
    name: '@destyler/alert',
    source: 'unpkg',
    description: 'Displays a callout for user attention.',
    url: 'https://unpkg.com/@destyler/alert@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/avatar',
    source: 'unpkg',
    description: 'On the Internet, nobody knows you are a dog.',
    url: 'https://unpkg.com/@destyler/avatar@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/back-top',
    source: 'unpkg',
    description: 'It helps you back to where you were. However, time never goes back.',
    url: 'https://unpkg.com/@destyler/back-top@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/button',
    source: 'unpkg',
    description: 'Displays a button',
    url: 'https://unpkg.com/@destyler/button@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/collapse',
    source: 'unpkg',
    description: 'I saw it appears in many side control panels.',
    url: 'https://unpkg.com/@destyler/collapse@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/countdown',
    source: 'unpkg',
    description: 'A second is passed after a second has passed.',
    url: 'https://unpkg.com/@destyler/countdown@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/icon',
    source: 'unpkg',
    description: 'Supporting Iconify, Emojis and custom components.',
    url: 'https://unpkg.com/@destyler/icon@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/label',
    source: 'unpkg',
    description: 'Renders an accessible label associated with controls.',
    url: 'https://unpkg.com/@destyler/label@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/online',
    source: 'unpkg',
    description: 'A reactive offline indicator component',
    url: 'https://unpkg.com/@destyler/online@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/popover',
    source: 'unpkg',
    description: 'Pop some hidden message around content.',
    url: 'https://unpkg.com/@destyler/popover@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/statistic',
    source: 'unpkg',
    description: 'Visually or semantically separates content.',
    url: 'https://unpkg.com/@destyler/statistic@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/tag',
    source: 'unpkg',
    description: 'Tags are great for showing attributes; and sometimes toggle options.',
    url: 'https://unpkg.com/@destyler/tag@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/time',
    source: 'unpkg',
    description: 'Time provide some basic formation for time.',
    url: 'https://unpkg.com/@destyler/time@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/tooltip',
    source: 'unpkg',
    description: 'It walks like a popover, quacks like a popover but looks a bit different from popover.',
    url: 'https://unpkg.com/@destyler/tooltip@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/shared',
    source: 'unpkg',
    description: 'Shared Destyler utilities.',
    url: 'https://unpkg.com/@destyler/shared@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/composition',
    source: 'unpkg',
    description: 'Collection of essential Destyler Composition Utilities',
    url: 'https://unpkg.com/@destyler/composition@0.0.1-beta.5/dist/index.mjs',
  },
  {
    name: '@destyler/directives',
    source: 'unpkg',
    description: 'Collection of essential Destyler Directives Utilities',
    url: 'https://unpkg.com/@destyler/directives@0.0.1-beta.5/dist/index.mjs',
  },
]

function loadInitialState() {
  removeAllFiles()

  if (location.hash.slice(1)) {
    const { files, packages } = JSON.parse(lz.decompressFromEncodedURIComponent(location.hash.slice(1)))

    console.log(files, packages)

    if (files && packages) {
      orchestrator.packages = packages

      for (const f in files) {
        console.log(f)
        addFile(new OrchestratorFile(f, files[f].template, files[f].script))
      }
      setActiveFile('App.vue')
      shouldUpdateContent.trigger(null)
    }
  }
  else {
    orchestrator.packages = initialPackages
    addFile(new OrchestratorFile('App.vue', appTemplate.trim(), appScript.trim()))
    setActiveFile('App.vue')
    shouldUpdateContent.trigger(null)
  }
}

setTimeout(() => {
  loadInitialState()
}, 0)
