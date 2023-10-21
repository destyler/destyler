<script setup lang="ts">
import { ref } from 'vue'
import { DestylerCollapse, DestylerCollapseItem } from '@destyler/components/collapse/src'
import { DestylerIcon } from '@destyler/components/icon/src'

const selected = ref('item1')
const items = [
  {
    title: 'What is your refund policy?',
    value: 'item1',
    content: 'If you\'re unhappy with your purchase for any reason, email us within 90 days and we\'ll refund you in full, no questions asked.',
  },
  {
    title: 'Do you offer technical support?',
    value: 'item2',
    content: 'No.',
  },
]
</script>

<template>
  <DestylerCollapse>
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

</style>
