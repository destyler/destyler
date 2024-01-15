<script setup lang="ts">
import { DestylerCollapseContent, DestylerCollapseHeader, DestylerCollapseItem, DestylerCollapseRoot, DestylerCollapseTrigger } from '../src'

const items = [
  {
    value: 'item-1',
    title: 'Hello 1 ?',
    content: 'Hello 111111111111111111111111111111111111',
  },
  {
    value: 'item-2',
    title: 'Hello 2 ?',
    content: 'Hello 222222222222222222222222222222222222',
  },
  {
    value: 'item-3',
    title: 'Hello 3 ?',
    content: 'Hello 333333333333333333333333333333333333',
  },
]
</script>

<template>
  <DestylerCollapseRoot
    default-value="'item-1'"
    type="single"
    :collapsible="true"
  >
    <template v-for="item in items" :key="item.value">
      <DestylerCollapseItem :value="item.value">
        <DestylerCollapseHeader>
          <DestylerCollapseTrigger>
            <span>{{ item.title }}</span>
          </DestylerCollapseTrigger>
        </DestylerCollapseHeader>
        <DestylerCollapseContent>
          <div>
            {{ item.content }}
          </div>
        </DestylerCollapseContent>
      </DestylerCollapseItem>
    </template>
  </DestylerCollapseRoot>
</template>
