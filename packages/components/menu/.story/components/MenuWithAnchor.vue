<script setup lang="ts">
import { useVModel } from '@destyler/composition'
import {
  MenuAnchor,
  MenuContent,
  MenuPortal,
  MenuRoot,
} from '../../src'

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
        class="inline-block box-border min-w-[130px] bg-white border border-gray-100 rounded-xl p-[5px] shadow-md font-sans text-[13px] focus-within:border-black"
        align="start"
        @close-auto-focus.prevent
      >
        <slot />
      </MenuContent>
    </MenuPortal>
  </MenuRoot>
</template>
