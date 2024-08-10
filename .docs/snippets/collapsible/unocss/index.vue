<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@destyler/button'
import { Icon } from '@destyler/icon'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '@destyler/collapsible'

const isOpen = ref<boolean>(false)
</script>

<template>
  <CollapsibleRoot v-model:open="isOpen" w="350px" space="y-2">
    <div
      flex="~"
      items="center"
      justify="between"
      space="x-4"
    >
      <h4
        text="sm primary!"
        font="semibold"
      >
        The best framework
      </h4>
      <CollapsibleTrigger as-child>
        <Button
          w="9!"
          p="0!"
          bg="hover:#F0F0F1 dark:hover:#27272A"
          text="#18181B dark:#FAFAFA sm"
          inline="flex"
          items="center"
          justify="center"
          whitespace="nowrap"
          rounded="md"
          font="medium"
          transition="colors"
          focus-visible="outline-none ring-1"
          disabled="pointer-events-none op-50"
          h="9"
          px="4"
          py="2"
          cursor="pointer"
        >
          <Icon name="radix-icons:caret-sort" w="4" h="4" />
          <span sr="only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <div
      rounded="md"
      border="~ #E4E4E7 dark:#27272A"
      text="dark dark:white sm"
      px="4"
      py="3"
      font="mono"
    >
      destyler
    </div>
    <CollapsibleContent
      space="y-2"
      overflow="hidden"
      transition="all"
      animate="data-[state=closed]:collapsible-up data-[state=open]:collapsible-down"
    >
      <div
        rounded="md"
        border="~ #E4E4E7 dark:#27272A"
        text="dark dark:light sm"
        px="4"
        py="3"
        font="mono"
      >
        vue
      </div>
      <div
        rounded="md"
        border="~ #E4E4E7 dark:#27272A"
        text="dark dark:light sm"
        px="4"
        py="3"
        font="mono"
      >
        nuxt
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
