<script setup lang="ts">
import { Button } from 'destyler'
import { useData } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  color: {
    value: string
    label: string
    hex: {
      light: string
      dark: string
    }
  }
  selected: string
}>()

const emits = defineEmits(['select'])

const { isDark } = useData()

const isSelected = computed(() => props.color.value === props.selected)
</script>

<template>
  <Button
    class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground py-2 h-8 justify-start px-3"
    :class="[isSelected ? 'border-foreground border-2' : 'border-input']"
    @click="emits('select', props.color)"
  >
    <span class="h-4 w-4 rounded-full flex items-center justify-center" :style="{ backgroundColor: `hsl(${isDark ? props.color.hex.dark : props.color.hex.light})` }" />
    <span class="ml-2 text-xs capitalize mt-px">{{ props.color.label }}</span>
  </Button>
</template>
