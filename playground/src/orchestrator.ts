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
      <style>
        ${this.style}
      </style>
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
<div
  grid="~ flow-col gap-4"
  place="content-center items-center"
  h="screen"
  font="mono"
>
  <DestylerButton>button</DestylerButton>
</div>

`
const appScript = `
import { DestylerButton } from '@destyler/button'
`

const appStyle = `
[destyler="button"]{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition-property: color, background-color, border-color, outline-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  --un-shadow: var(--un-shadow-inset) 0 1px 3px 0 var(--un-shadow-color, rgb(0 0 0 / 0.1)), var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
  height: 2.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: #dedede;
  background-color: #18181b;
  cursor: pointer;
}
.dark [destyler="button"] {
  background-color: #fafafa;
  color: #18181b;
}
.dark [destyler="button"]:hover {
  background-color: #e2e2e2;
}
[destyler="button"]:hover{
  background-color: #2f2f31;
}
[destyler="button"]:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --un-ring-width: 1px;
  --un-ring-offset-shadow: var(--un-ring-inset) 0 0 0
    var(--un-ring-offset-width) var(--un-ring-offset-color);
  --un-ring-shadow: var(--un-ring-inset) 0 0 0
    calc(var(--un-ring-width) + var(--un-ring-offset-width))
    var(--un-ring-color);
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow),
    var(--un-shadow);
}
[destyler="button"]:disabled {
  pointer-events: none;
  opacity: 0.5;
}
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

    if (files && packages) {
      orchestrator.packages = packages

      for (const f in files) 
        addFile(new OrchestratorFile(f, files[f].template, files[f].script))
      
      setActiveFile('App.vue')
      shouldUpdateContent.trigger(null)
    }
  }
  else {
    orchestrator.packages = initialPackages
    addFile(new OrchestratorFile('App.vue', appTemplate.trim(), appScript.trim(), appStyle.trim()))
    setActiveFile('App.vue')
    shouldUpdateContent.trigger(null)
  }
}

setTimeout(() => {
  loadInitialState()
}, 0)
