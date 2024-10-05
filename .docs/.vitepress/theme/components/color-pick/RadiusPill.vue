<script setup lang="ts">
import { Button } from 'destyler'
import { computed } from 'vue'

const props = defineProps<{
  radius: number
  selected: number
}>()

const emits = defineEmits(['select'])

const isSelected = computed(() => props.radius === props.selected)
</script>

<template>
  <Button
    class="
    inline-flex items-center whitespace-nowrap
    rounded-md text-sm font-medium transition-colors
    focus-visible:outline-none focus-visible:ring-1
    focus-visible:ring-ring disabled:pointer-events-none
    disabled:opacity-50 border bg-background shadow-sm
    hover:bg-accent hover:text-accent-foreground py-2 h-8
    justify-center px-3"
    :class="[isSelected ? 'border-foreground border-2' : 'border-input']"
    @click="emits('select', props.radius)"
  >
    <span class="text-xs ">
      {{ props.radius }}
    </span>
  </Button>
</template>
