<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h2)
</script>

<template>
  <h2 :id="id" class="mt-12 scroll-m-20 border-b border-#e4e4e7 dark:border-#1c1c1f pb-2 text-2xl font-semibold tracking-tight first:mt-0">
    <a
      v-if="generate"
      :href="`#${id}`"
      class="font-medium"
    >
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
