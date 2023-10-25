<script setup lang="ts">
import { DestylerCollapse, DestylerCollapseItem } from '@destyler/components/collapse/src'
import { DestylerIcon } from '@destyler/components/icon/src'
</script>

<template>
  <DestylerCollapse default-expanded-names="1" accordion class="min-w-70% w-full">
    <DestylerCollapseItem title="青铜" name="1">
      <template #header-extra="{ handleClick }">
        <DestylerIcon name="i-carbon-chevron-down" @click="handleClick" />
      </template>
      <div>可以</div>
    </DestylerCollapseItem>
    <DestylerCollapseItem title="白银" name="2">
      <template #header-extra="{ handleClick }">
        <DestylerIcon name="i-carbon-chevron-down" @click="handleClick" />
      </template>
      <div>很好</div>
    </DestylerCollapseItem>
    <DestylerCollapseItem title="黄金" name="3">
      <template #header-extra="{ handleClick }">
        <DestylerIcon name="i-carbon-chevron-down" @click="handleClick" />
      </template>
      <div>真棒</div>
    </DestylerCollapseItem>
  </DestylerCollapse>
</template>

<style scoped>
[destyler="collapse-item"]{
  @apply border-b box-border border-#e5e7eb border-op-10;
}
[destyler="collapse-item"] :deep([destyler="collapse-item-header"]){
  @apply flex cursor-pointer overflow-hidden;
  @apply flex flex-1 items-center justify-between py-2 text-sm font-medium transition-all hover:underline;
}
[destyler-status="open"]:deep([destyler="collapse-item-header-extra"]){
  @apply rotate-180 transition-all;
}

[destyler-status="close"]:deep([destyler="collapse-item-header-extra"]){
  @apply rotate-0 transition-all;
}

[destyler="collapse-item"] :deep([destyler="collapse-item-content"]){
  @apply text-sm;
}
</style>
