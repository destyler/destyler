<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from '@destyler/toggle'
import { Icon } from '@destyler/icon'

const value = ref<string[]>(['bold'])

const options = ref<{ value: string, icon: string }[]>([
  {
    value: 'bold',
    icon: 'radix-icons:font-bold',
  },
  {
    value: 'italic',
    icon: 'radix-icons:font-italic',
  },
  {
    value: 'line',
    icon: 'radix-icons:underline',
  },
])
</script>

<template>
  <ToggleGroupRoot
    v-model="value"
    flex="~"
    items="center"
    justify="center"
    gap="1"
    type="multiple"
  >
    <ToggleGroupItem
      v-for="option in options" :key="option.value" :value="option.value"
      inline="flex"
      items="center"
      justify="center"
      rounded="md"
      text="sm hover:muted-foreground data-[state=on]:accent-foreground"
      font="medium"
      transition="colors"
      bg="hover:muted transparent data-[state=on]:accent"
      focus-visible="outline-none ring-1 ring-ring"
      pointer-events="disabled:none"
      op="disabled:50"
      h="9"
      p="x-3"
    >
      <Icon
        :name="option.icon"
        text="dark dark:light"
        h="6"
        w="6"
      />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
