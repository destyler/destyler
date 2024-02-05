<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h2)
</script>

<template>
  <h3 :id="id" class="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
    <NuxtLink
      v-if="generate"
      :href="`#${id}`"
      class=""
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h3>
</template>
