<script setup lang="ts">
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { DestylerDismissableLayer } from '../src'

defineProps<{
  openLabel?: string
  closeLabel?: string
  outsideLabel?: string
}>()

const emits = defineEmits(['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'])

const open = ref(false)

function handleDismiss() {
  open.value = false
}
</script>

<template>
  <div>
    <button @click="open = !open">
      {{ openLabel }}
    </button>

    <DestylerDismissableLayer
      v-if="open"
      v-bind="useEmitAsProps(emits)"
      @dismiss="handleDismiss"
    >
      <div>Content</div>
      <button type="button" @click="open = false">
        {{ closeLabel }}
      </button>
    </DestylerDismissableLayer>

    <button>
      {{ outsideLabel }}
    </button>
  </div>
</template>
