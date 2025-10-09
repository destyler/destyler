import { atom, onMount } from 'nanostores'

export type Framework = 'vue' | 'react' | 'svelte' | 'solid'

export const frameworkData: {
  icon: string
  value: Framework
  label: string
}[] = [
  { icon: 'i-logos:vue', value: 'vue', label: 'Vue' },
  { icon: 'i-logos:react', value: 'react', label: 'React' },
  { icon: 'i-logos:svelte-icon', value: 'svelte', label: 'Svelte' },
  { icon: 'i-logos:solidjs-icon', value: 'solid', label: 'Solid' },
]

export const LOCAL_STORAGE_KEY = 'destyler-framework'

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined'

export const $framework = atom<Framework | undefined>()

onMount($framework, () => {
  if (isBrowser) {
    const framework = localStorage.getItem(LOCAL_STORAGE_KEY) as Framework
    if (framework === null || framework === undefined) {
      $framework.set('react')
    }
    else {
      $framework.set(framework)
    }
  }
  else {
    // 服务器端渲染时设置默认值
    $framework.set('react')
  }
})

$framework.subscribe((value) => {
  if (isBrowser) {
    localStorage.setItem(LOCAL_STORAGE_KEY, value || 'react')
  }
})
