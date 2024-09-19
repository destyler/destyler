<script setup lang="ts">
import { ref } from 'vue'
import { Toggle } from '@destyler/toggle'
import { Icon } from '@destyler/icon'

const value = ref(true)
</script>

<template>
  <Toggle
    v-model:pressed="value"
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
      name="carbon:text-font"
      text="dark dark:light"
      h="6"
      w="6"
    />
  </Toggle>
</template>
