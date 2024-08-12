<script setup lang="ts">
// @noErrors
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
  <div
    flex="~"
    w="full"
    justify="center"
    items="center"
  >
    <CollapseRoot
      class="w-full"
      default-value="'item-1'"
      type="single"
      :collapsible="true"
    >
      <template v-for="item in items" :key="item.value">
        <CollapseItem
          border="b primary/15"
          :value="item.value"
        >
          <CollapseHeader flex="~">
            <CollapseTrigger
              cursor="pointer"
              text="primary/80 sm"
              flex="~ 1"
              items="center"
              justify="between"
              py="4"
              font="medium"
              transition="all"
              hover="underline"
              rotate="[&[data-state=open]>svg]:180"
            >
              <span>{{ item.title }}</span>
              <Icon
                name="radix-icons:chevron-down"
                h="4"
                w="4"
                shrink="0"
                text="accent-foreground"
                transition="transform"
                duration="200"
              />
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            overflow="hidden"
            text="black dark:white sm"
            animate="data-[state=closed]:collapse-up data-[state=open]:collapse-down"
          >
            <div p="b-4 t-0">
              {{ item.content }}
            </div>
          </CollapseContent>
        </CollapseItem>
      </template>
    </CollapseRoot>
  </div>
</template>
