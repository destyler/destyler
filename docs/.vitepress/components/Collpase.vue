<script setup lang="ts">
import { DestylerCollapse, DestylerCollapseItem } from '@destyler/components/collapse/src'
</script>

<template>
  <DestylerCollapse default-expanded-names="1" accordion class="min-w-70% w-full">
    <DestylerCollapseItem title="青铜" name="1">
      <div>可以</div>
    </DestylerCollapseItem>
    <DestylerCollapseItem title="白银" name="2">
      <div>很好</div>
    </DestylerCollapseItem>
    <DestylerCollapseItem title="黄金" name="3">
      <div>真棒</div>
    </DestylerCollapseItem>
  </DestylerCollapse>
</template>

<style scoped>
[destyler="collapse-item"]{
  @apply border-b box-border border-#e5e7eb border-op-10 my-4;
}
[destyler="collapse-item"] :deep([destyler="collapse-item-header"]){
  @apply flex cursor-pointer overflow-hidden;
}
</style>
