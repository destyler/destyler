import { useStorage } from '@vueuse/core'
import { useData } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'

export function useAppearance() {
  const { isDark } = useData()

  const theme = useStorage('destyler-vitepress-theme-apperarance', 'dark')

  onMounted(() => {
    watch(theme, (v, o) => {
      document.documentElement.classList.remove(o!)
      document.documentElement.classList.add(v)
      isDark.value = v === 'dark'
    }, {
      immediate: true,
    })
  })

  function toggleDark() {
  // @ts-expect-error experimental API
    const isAppearanceTransition = document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isAppearanceTransition) {
      isDark.value = !isDark.value
      theme.value = isDark.value ? 'dark' : 'light'
      return
    }
    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      theme.value = isDark.value ? 'dark' : 'light'
      await nextTick()
    })
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            duration: 400,
            easing: 'ease-out',
            pseudoElement: isDark.value
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        )
      })
  }
  return {
    toggleDark,
    theme,
    isDark,
  }
}
