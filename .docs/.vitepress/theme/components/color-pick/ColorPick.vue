<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'destyler'

import { themes } from '~/colors/themes'

const colors = computed(() => {
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

const primary = useStorage('destyler-vitepress-theme-color', 'zinc')
const radius = useStorage('destyler-vitepress-theme-radius', 0.5)

onMounted(() => {
  nextTick(() => {
    watch(primary, (newColor, oldColor) => {
      document.body.classList.remove(`theme-${oldColor}`)
      document.body.classList.add(`theme-${newColor}`)
      primary.value = newColor
    }, {
      immediate: true,
    })

    watch(radius, (value) => {
      document.body.style.setProperty('--radius', `${value}rem`)
    }, {
      immediate: true,
    })
  })
})

function handleSelectColor(color: any) {
  primary.value = color.value
}

function handleSetRadius(r: number) {
  radius.value = r
}

const RADII = [0, 0.25, 0.5, 0.75, 1]
</script>

<template>
  <ClientOnly>
    <PopoverRoot>
      <PopoverTrigger as-child v-bind="$attrs">
        <slot />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          side="bottom"
          :side-offset="5"
          class="
          rounded-md border border-solid border-border p-4 shadow-md
          z-50 bg-card text-card-foreground outline-none w-24rem
          data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2;
          "
          align="end"
          as-child
        >
          <div class="p-4">
            <div class="grid space-y-1">
              <h1 class="text-md text-foreground font-semibold">
                Customize
              </h1>
              <p class="text-xs text-muted-foreground">
                Pick a style and color for your components.
              </p>
            </div>
            <div class="space-y-1.5 pt-6">
              <Label for="color" class="text-xs"> Color </Label>
              <div class="grid grid-cols-3 gap-2 py-1.5">
                <ColorPickPill
                  v-for="color in colors"
                  :key="color.value"
                  :color="color"
                  :selected="primary"
                  @select="handleSelectColor"
                />
              </div>
            </div>
            <div class="space-y-1.5 pt-6">
              <Label for="radius" class="text-xs"> Radius </Label>
              <div class="grid grid-cols-5 gap-2 py-1.5">
                <RadiusPill
                  v-for="r in RADII"
                  :key="r"
                  :radius="r"
                  :selected="radius"
                  @select="handleSetRadius"
                />
              </div>
            </div>
            <div class="space-y-1.5 pt-6">
              <Label for="theme" class="text-xs"> Theme </Label>
              <div class="flex space-x-2 py-1.5">
                <ColorAppearance />
              </div>
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </ClientOnly>
</template>
