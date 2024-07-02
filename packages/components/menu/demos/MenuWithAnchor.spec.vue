<script setup lang="ts">
import { useVModel } from '@destyler/composition'
import {
  MenuAnchor,
  MenuContent,
  MenuPortal,
  MenuRoot,
} from '../src'

interface MenuProps {
  open?: boolean
  dir?: string
  modal?: boolean
}

interface Props extends MenuProps {}
const props = withDefaults(defineProps<Props>(), {
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
