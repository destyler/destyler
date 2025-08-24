import { atom, onMount } from 'nanostores'

export type CSSFramework = 'css' | 'tailwind' | 'unocss'

export const styleFrameworkData: {
  icon: string
  value: CSSFramework
  label: string
}[] = [
  { icon: 'i-logos:css-3', value: 'css', label: 'CSS' },
  { icon: 'i-logos:tailwindcss-icon', value: 'tailwind', label: 'Tailwind' },
  { icon: 'i-logos:unocss', value: 'unocss', label: 'UnoCSS' },
]

export const LOCAL_STORAGE_KEY = 'destyler-style-framework'

export const $style = atom<CSSFramework | undefined>()

onMount($style, () => {
  const framework = localStorage.getItem(LOCAL_STORAGE_KEY) as CSSFramework
  if (framework === null || framework === undefined) {
    $style.set('unocss')
  }
  else {
    $style.set(framework)
  }
})

$style.subscribe((value) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, value || 'unocss')
})
