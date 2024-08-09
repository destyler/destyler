<script setup lang="ts">
import { Icon } from 'destyler'
import { computed } from 'vue'

const props = defineProps<{
  name: string
}>()

const fileName = computed(() => {
  if (props.name.includes('vue')) {
    return 'vscode-icons:file-type-vue'
  }
  else if (props.name.includes('tailwind')) {
    return 'vscode-icons:file-type-tailwind'
  }
  else if (props.name.includes('css')) {
    return 'vscode-icons:file-type-css'
  }
  else if (props.name.includes('unocss') || props.name.includes('uno')) {
    return 'vscode-icons:file-type-unocss'
  }
  else {
    return 'vscode-icons:default-file'
  }
})
</script>

<template>
  <Icon :name="fileName" />
</template>
