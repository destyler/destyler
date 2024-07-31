<script setup lang="ts">
import { useVModel } from '@destyler/composition'
import {
  MenuAnchor,
  MenuContent,
  MenuPortal,
  MenuRoot,
} from '../src'

const props = withDefaults(defineProps<{
  open?: boolean | undefined
  dir?: any | undefined
  modal?: boolean | undefined
}>(), {
  open: true,
})

const open = useVModel(props, 'open')
</script>

<template>
  <MenuRoot :open="open" :modal="false">
    <MenuAnchor :style="{ display: 'inline-block' }" />
    <MenuPortal>
      <MenuContent
        align="start"
        @close-auto-focus.prevent
      >
        <slot />
      </MenuContent>
    </MenuPortal>
  </MenuRoot>
</template>
