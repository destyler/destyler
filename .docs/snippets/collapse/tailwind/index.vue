<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '@destyler/collapse'

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
  <div class="flex w-full justify-center items-center">
    <CollapseRoot
      class="w-full"
      default-value="'item-1'"
      type="single"
      :collapsible="true"
    >
      <template v-for="item in items" :key="item.value">
        <CollapseItem class="border-b border-primary/15" :value="item.value">
          <CollapseHeader class="flex">
            <CollapseTrigger class="cursor-pointer text-primary/80 flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
              <span>{{ item.title }}</span>
              <Icon
                name="radix-icons:chevron-down"
                class="h-4 w-4 shrink-0 text-accent-foreground transition-transform duration-200"
              />
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="overflow-hidden text-black dark:text-white text-sm data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
            <div class="pb-4 pt-0">
              {{ item.content }}
            </div>
          </CollapseContent>
        </CollapseItem>
      </template>
    </CollapseRoot>
  </div>
</template>
