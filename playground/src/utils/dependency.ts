import { gte } from 'semver'
import type { Ref } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import type { Versions } from '@/composables/store'
import type { ImportMap } from '@/utils/import-map'

export interface Dependency {
  pkg?: string
  version?: string
  path: string
}

export type Cdn = 'unpkg' | 'jsdelivr' | 'jsdelivr-fastly'
export const cdn = useLocalStorage<Cdn>('setting-cdn', 'jsdelivr-fastly')

export const genCdnLink = (
  pkg: string,
  version: string | undefined,
  path: string
) => {
  version = version ? `@${version}` : ''
  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'unpkg':
      return `https://unpkg.com/${pkg}${version}${path}`
  }
}

export const genVueLink = (version: string) => {
  const compilerSfc = genCdnLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js'
  )
  const runtimeDom = genCdnLink(
    '@vue/runtime-dom',
    version,
    '/dist/runtime-dom.esm-browser.js'
  )
  return {
    compilerSfc,
    runtimeDom,
  }
}

export const genImportMap = (
  { vue, destyler }: Partial<Versions> = {},
  nightly: boolean
): ImportMap => {
  const deps: Record<string, Dependency> = {
    vue: {
      pkg: '@vue/runtime-dom',
      version: vue,
      path: '/dist/runtime-dom.esm-browser.js',
    },
    '@vue/shared': {
      version: vue,
      path: '/dist/shared.esm-bundler.js',
    },
    '@destyler/aspect-radio': {
      pkg: '@destyler/aspect-radio',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/back-top': {
      pkg: '@destyler/back-top',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/breadcrumbs': {
      pkg: '@destyler/breadcrumbs',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/button': {
      pkg: '@destyler/button',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/checkbox': {
      pkg: '@destyler/checkbox',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/collapse': {
      pkg: '@destyler/collapse',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/collapsible': {
      pkg: '@destyler/collapsible',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/combobox': {
      pkg: '@destyler/combobox',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/context-menu': {
      pkg: '@destyler/context-menu',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/countdown': {
      pkg: '@destyler/countdown',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/dialog': {
      pkg: '@destyler/dialog',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/divider': {
      pkg: '@destyler/divider',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/dropdown': {
      pkg: '@destyler/dropdown',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/hover-card': {
      pkg: '@destyler/hover-card',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/icon': {
      pkg: '@destyler/icon',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/image': {
      pkg: '@destyler/image',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/info': {
      pkg: '@destyler/info',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/label': {
      pkg: '@destyler/label',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/link': {
      pkg: '@destyler/link',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/menubar': {
      pkg: '@destyler/menubar',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/modal': {
      pkg: '@destyler/modal',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/navigation': {
      pkg: '@destyler/navigation',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/online': {
      pkg: '@destyler/online',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/pagination': {
      pkg: '@destyler/pagination',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/popover': {
      pkg: '@destyler/popover',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/preview': {
      pkg: '@destyler/preview',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/progress': {
      pkg: '@destyler/progress',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/radio': {
      pkg: '@destyler/radio',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/scroll-area': {
      pkg: '@destyler/scroll-area',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/select': {
      pkg: '@destyler/select',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/slider': {
      pkg: '@destyler/slider',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/switch': {
      pkg: '@destyler/switch',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/tabs': {
      pkg: '@destyler/tabs',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/toast': {
      pkg: '@destyler/toast',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/toggle': {
      pkg: '@destyler/toggle',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/toolbar': {
      pkg: '@destyler/toolbar',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/tooltip': {
      pkg: '@destyler/tooltip',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/dynamic': {
      pkg: '@destyler/dynamic',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/otp-input': {
      pkg: '@destyler/otp-input',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/draggable': {
      pkg: '@destyler/draggable',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/qr-code': {
      pkg: '@destyler/qr-code',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/splitter': {
      pkg: '@destyler/splitter',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/ellipsis': {
      pkg: '@destyler/ellipsis',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/calendar': {
      pkg: '@destyler/calendar',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/range-calendar': {
      pkg: '@destyler/range-calendar',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/primitive': {
      pkg: '@destyler/primitive',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/shared': {
      pkg: '@destyler/shared',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/composition': {
      pkg: '@destyler/composition',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/directives': {
      pkg: '@destyler/directives',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/presence': {
      pkg: '@destyler/presence',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/popper': {
      pkg: '@destyler/popper',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/arrow': {
      pkg: '@destyler/arrow',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/menu': {
      pkg: '@destyler/menu',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/focus-scope': {
      pkg: '@destyler/focus-scope',
      version: destyler,
      path: '/dist/index.mjs',
    },
    '@destyler/roving-focus': {
      pkg: '@destyler/roving-focus',
      version: destyler,
      path: '/dist/index.mjs',
    },
    "@destyler/collection": {
      pkg: '@destyler/collection',
      version: destyler,
      path: '/dist/index.mjs',
    },
    "@destyler/dismissable-layer": {
      pkg: '@destyler/dismissable-layer',
      version: destyler,
      path: '/dist/index.mjs',
    },
    "@destyler/teleport": {
      pkg: '@destyler/teleport',
      version: destyler,
      path: '/dist/index.mjs',
    },
    "@destyler/visually-hidden": {
      pkg: '@destyler/visually-hidden',
      version: destyler,
      path: '/dist/index.mjs',
    },
    "@destyler/visually-hidden/dist/component": {
      pkg: '@destyler/visually-hidden',
      version: destyler,
      path: '/dist/component.mjs',
    },
    "@destyler/calendar/dist/composition": {
      pkg: '@destyler/calendar',
      version: destyler,
      path: '/dist/composition.mjs',
    },
    "@destyler/focus-scope/dist/utils": {
      pkg: '@destyler/focus-scope',
      version: destyler,
      path: '/dist/utils.mjs',
    },
    '@internationalized/date': {
      pkg: '@internationalized/date',
      version: '3.5.2',
      path: '/+esm',
    },
    'aria-hidden': {
      pkg: 'aria-hidden',
      version: '1.2.3',
      path: '/dist/es2015/index.min.js',
    },
    '@vueuse/core': {
      pkg: '@vueuse/core',
      version: '10.9.0',
      path: '/+esm',
    },
    '@vueuse/shared': {
      pkg: '@vueuse/shared',
      version: '10.9.0',
      path: '/+esm',
    },
    'defu': {
      pkg: 'defu',
      version: '6.1.4',
      path: '/dist/defu.mjs',
    },
    'scule': {
      pkg: 'scule',
      version: '1.3.0',
      path: '/dist/index.mjs',
    },
    'fast-deep-equal': {
      pkg: 'fast-deep-equal',
      version: '3.1.3',
      path: '/index.min.js',
    },
    '@floating-ui/vue': {
      pkg: '@floating-ui/vue',
      version: '1.0.6',
      path: '/dist/floating-ui.vue.umd.min.js',
    },
    '@iconify/vue': {
      pkg: '@iconify/vue',
      version: '4.1.1',
      path: '/dist/iconify.min.js',
    },
    'nanoid/non-secure': {
      pkg: 'nanoid',
      version: '5.0.6',
      path: '/non-secure/index.js',
    },

  }

  return {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg ?? key, dep.version, dep.path),
      ])
    ),
  }
}

export const getVersions = (pkg: MaybeRef<string>) => {
  const url = computed(
    () => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`
  )
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
    refetch: true,
  }).json<string[]>().data as Ref<string[]>
}

export const getSupportedVueVersions = () => {
  const versions = getVersions('vue')
  return computed(() =>
    versions.value.filter((version) => gte(version, '3.2.0'))
  )
}

export const getSupportedTSVersions = () => {
  const versions = getVersions('typescript')
  return computed(() =>
    versions.value.filter(
      (version) => !version.includes('dev') && !version.includes('insiders')
    )
  )
}

export const getSupportedEpVersions = (nightly: MaybeRef<boolean>) => {
  const pkg = computed(() =>
    unref(nightly) ? 'destyler' : 'destyler'
  )
  const versions = getVersions(pkg)
  return computed(() => {
    if (unref(nightly)) return versions.value
    return versions.value.filter((version) => gte(version, '0.0.1-beta.7'))
  })
}
