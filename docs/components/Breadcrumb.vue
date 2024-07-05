<script setup lang="ts">
import {
  BreadcrumbsContent,
  BreadcrumbsItem,
  BreadcrumbsLabel,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
} from 'destyler'

const props = defineProps<{
  items: string[]
}>()

const breadcrumbItems = computed(() => {
  return props.items.filter(item => item)
})

function upperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <BreadcrumbsRoot>
    <BreadcrumbsContent class="mb-4 flex items-center space-x-1 text-sm">
      <BreadcrumbsItem
        v-for="item in breadcrumbItems"
        :key="item"
        class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60"
      >
        <BreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
        >
          {{ upperCase(item) }}
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator class="w-2">
          >
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
