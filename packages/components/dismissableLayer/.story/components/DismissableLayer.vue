<script setup lang="ts">
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { DismissableLayer } from '../../src'

defineProps<{
  openLabel?: string
  closeLabel?: string
  outsideLabel?: string
}>()

const emits = defineEmits(['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside'])

const open = ref(false)

function handleDismiss() {
  open.value = false
}
</script>

<template>
  <div class="flex flex-col">
    <button @click="open = !open">
      {{ openLabel }}
    </button>

    <DismissableLayer
      v-if="open"
      id="layer"
      v-bind="useEmitAsProps(emits)"
      @dismiss="handleDismiss"
    >
      <div>Content</div>
      <button type="button" @click="open = false">
        {{ closeLabel }}
      </button>
    </DismissableLayer>

    <button>
      {{ outsideLabel }}
    </button>
  </div>
</template>
