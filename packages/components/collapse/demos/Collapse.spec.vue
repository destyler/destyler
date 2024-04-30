<script setup lang="ts">
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import type {
  DestylerCollapseRootProps,
} from '../src'
import {
  DestylerCollapseContent,
  DestylerCollapseHeader,
  DestylerCollapseItem,
  DestylerCollapseRoot,
  DestylerCollapseTrigger,
} from '../src'

withDefaults(defineProps<{
  type?: DestylerCollapseRootProps['type']
}>(), {
  type: 'single',
})
const emits = defineEmits(['update:modelValue'])
const values = ['One', 'Two', 'Three', 'Four']
const count = ref(1)
</script>

<template>
  <DestylerCollapseRoot
    v-bind="useEmitAsProps(emits)"
    :type="type"
  >
    <DestylerCollapseItem
      v-for="value in values"
      :key="value"
      :value="value"
    >
      <DestylerCollapseHeader>
        <DestylerCollapseTrigger>
          {{ value }}
        </DestylerCollapseTrigger>
      </DestylerCollapseHeader>
      <DestylerCollapseContent
        v-for="i in count"
        :key="i"
      >
        <div>
          Content {{ value }}
        </div>
      </DestylerCollapseContent>
    </DestylerCollapseItem>
  </DestylerCollapseRoot>
</template>
