<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '@destyler/collapse'
import 'style.css'

const items = ref([
  {
    value: 'item-1',
    title: 'Is it accessible?',
    content: 'Yes. It adheres to the WAI-ARIA design pattern.',
  },
  {
    value: 'item-2',
    title: 'Is it unstyled?',
    content: 'Yes. It\'s unstyled by default, giving you freedom over the look and feel.',
  },
  {
    value: 'item-3',
    title: 'Can it be animated?',
    content: 'Yes! You can use the transition prop to configure the animation.',
  },
])
</script>

<template>
  <div class="box">
    <CollapseRoot
      class="collapseRoot"
      default-value="'item-1'"
      type="single"
      :collapsible="true"
    >
      <template v-for="item in items" :key="item.value">
        <CollapseItem class="collapseItem" :value="item.value">
          <CollapseHeader class="collapseHeader">
            <CollapseTrigger class="collapseTrigger">
              <span>{{ item.title }}</span>
              <Icon
                name="radix-icons:chevron-down"
                class="icon"
              />
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
            <div class="title">
              {{ item.content }}
            </div>
          </CollapseContent>
        </CollapseItem>
      </template>
    </CollapseRoot>
  </div>
</template>
