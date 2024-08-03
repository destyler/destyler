<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

const props = defineProps<{
  name: string
  files?: string
}>()

const cssFramework = useStorage<'css' | 'tailwind' | 'pinceau' | 'unocss' >('cssFramework', 'unocss')
const parsedFiles = computed(() => JSON.parse(decodeURIComponent(props.files ?? ''))[cssFramework.value])
</script>

<template>
  <Container
    :folder="name"
    :css-framework="cssFramework"
    :files="parsedFiles"
  >
    <template #default>
      <slot />
    </template>

    <template #code>
      <CodeGroup v-model="cssFramework">
        <slot name="unocss" />
        <slot name="tailwind" />
        <slot name="css" />
      </CodeGroup>
    </template>
  </Container>
</template>
