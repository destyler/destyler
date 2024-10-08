<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '../src'

const items = [
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
]

const selected = ref('')
</script>

<template>
  <div class="flex min-h-[350px] w-full justify-center p-10 items-center">
    <CollapseRoot
      v-model="selected"
      class="w-full"
      default-value="item-1"
      type="single"
      :collapsible="true"
    >
      <template v-for="item in items" :key="item.value">
        <CollapseItem class="border-b border-#E4E4E7 dark:border-#27272A" :value="item.value">
          <CollapseHeader class="flex">
            <CollapseTrigger class="cursor-pointer flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
              <span>{{ item.title }}</span>
              <Icon
                name="radix-icons:chevron-down"
                class="h-4 w-4 shrink-0 dark:text-#A1A1AA transition-transform duration-200"
              />
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="overflow-hidden text-sm data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
            <div class="pb-4 pt-0">
              {{ item.content }}
            </div>
          </CollapseContent>
        </CollapseItem>
      </template>
    </CollapseRoot>
  </div>
</template>

<style scoped>
.data-\[state\=open\]\:animate-collapse-down[data-state=open] {
  animation: collapse-down .2s ease-out
}

.data-\[state\=closed\]\:animate-collapse-up[data-state=closed] {
  animation: collapse-up .2s ease-out
}

@keyframes collapse-up {
  0% {
    height: var(--destyler-collapse-content-height)
  }
  to {
    height: 0
  }
}

@keyframes collapse-down {
  0% {
    height: 0
  }
  to {
    height: var(--destyler-collapse-content-height)
  }
}
</style>
