<script setup lang="ts">
import { Button, Icon } from 'destyler'
import { ref } from 'vue'
import { useAppearance } from '../../composables/appearance'

const { toggleDark, isDark } = useAppearance()

const themes = ref([
  {
    label: 'Light',
    icon: 'carbon:sun',
    selected: false,
  },
  {
    label: 'Dark',
    icon: 'carbon:moon',
    selected: true,
  },
])
</script>

<template>
  <Button
    v-for="theme in themes"
    :key="theme.label"
    class="
    inline-flex items-center whitespace-nowrap
    rounded-md text-sm font-medium transition-colors
    focus-visible:outline-none focus-visible:ring-1
    focus-visible:ring-ring disabled:pointer-events-none
    disabled:opacity-50 border bg-background shadow-sm
    hover:bg-accent hover:text-accent-foreground py-2 h-8
    justify-center px-3"
    :class="[isDark === theme.selected ? 'border-foreground border-2' : 'border-input']"
    @click="toggleDark"
  >
    <Icon :name="theme.icon" class="w-4 h-4 mr-2" />
    <span class="text-xs ">
      {{ theme.label }}
    </span>
  </Button>
</template>
