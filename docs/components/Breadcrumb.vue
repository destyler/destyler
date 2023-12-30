<script setup lang="ts">
import { DestylerLabel } from '@destyler/label/src/label'
import { DestylerIcon } from '@destyler/icon/src/icon'

const props = defineProps<{
  items: string[]
}>()

const breadcrumbItems = computed(() => {
  // 清空 props.items 中的空字符串
  return props.items.filter(item => item)
})

function upperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="mb-4 flex items-center space-x-1 text-sm">
    <DestylerLabel
      v-for="item, index in breadcrumbItems"
      :key="item"
      class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa"
      :class="{
        'text-op-100!': index + 1 === breadcrumbItems.length,
        'text-op-60!': index + 1 !== breadcrumbItems.length,
      }"
    >
      <div
        class="overflow-hidden text-ellipsis whitespace-nowrap "
      >
        {{ upperCase(item) }}
      </div>
      <DestylerIcon v-if="index + 1 !== breadcrumbItems.length" class="w-4 h-4" name="i-ri-arrow-right-s-line" />
    </DestylerLabel>
  </div>
</template>
