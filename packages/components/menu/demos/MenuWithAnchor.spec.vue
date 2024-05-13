<script setup lang="ts">
import { useVModel } from '@destyler/composition'
import {
  DestylerMenuAnchor,
  DestylerMenuContent,
  DestylerMenuPortal,
  DestylerMenuRoot,
} from '../src'

interface DestylerMenuProps {
  open?: boolean
  dir?: string
  modal?: boolean
}

interface Props extends DestylerMenuProps {}
const props = withDefaults(defineProps<Props>(), {
  open: true,
})

const open = useVModel(props, 'open')
</script>

<template>
  <DestylerMenuRoot :open="open" :modal="false">
    <DestylerMenuAnchor :style="{ display: 'inline-block' }" />
    <DestylerMenuPortal>
      <DestylerMenuContent
        align="start"
        @close-auto-focus.prevent
      >
        <slot />
      </DestylerMenuContent>
    </DestylerMenuPortal>
  </DestylerMenuRoot>
</template>
