<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'destyler'

import ColorPickerPill from './ColorPickerPill.vue'
import { themes } from '~/colors/themes'

const primarys = computed(() => {
  const result = []
  for (const theme of themes) {
    result.push({
      value: theme.name,
      label: theme.label,
      hex: theme.activeColor,
    })
  }
  return result
})

const primary = useStorage('destyler-ui-primary', 'zinc')

onMounted(() => {
  nextTick(() => {
    watch(primary, (newColor, oldColor) => {
      document.body.classList.remove(`theme-${oldColor}`)
      document.body.classList.add(`theme-${newColor}`)
      primary.value = newColor
    }, {
      immediate: true,
    })
  })
})

function handleSelectColor(color: any) {
  primary.value = color.value
}
</script>

<template>
  <HoverCardRoot :open-delay="100">
    <HoverCardTrigger>
      <slot />
    </HoverCardTrigger>
    <HoverCardPortal>
      <Transition name="fade">
        <HoverCardContent
          class="z-90 w-[156px] rounded-md bg-light border border-solid border-dark border-op-9 dark:bg-black dark:border dark:border-solid dark:border-white dark:border-op-9 py-2 px-4"
          :side-offset="5"
          :as-child="true"
        >
          <div class="grid grid-cols-5 gap-px">
            <ColorPickerPill v-for="color in primarys" :key="color.value" :color="color" :selected="primary" @select="handleSelectColor" />
          </div>
        </HoverCardContent>
      </Transition>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
