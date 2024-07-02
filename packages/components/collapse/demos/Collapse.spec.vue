<script setup lang="ts">
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import type {
  CollapseRootProps,
} from '../src'
import {
  CollapseContent,
  CollapseHeader,
  CollapseItem,
  CollapseRoot,
  CollapseTrigger,
} from '../src'

withDefaults(defineProps<{
  type?: CollapseRootProps['type']
}>(), {
  type: 'single',
})
const emits = defineEmits(['update:modelValue'])
const values = ['One', 'Two', 'Three', 'Four']
const count = ref(1)
</script>

<template>
  <CollapseRoot
    v-bind="useEmitAsProps(emits)"
    :type="type"
  >
    <CollapseItem
      v-for="value in values"
      :key="value"
      :value="value"
    >
      <CollapseHeader>
        <CollapseTrigger>
          {{ value }}
        </CollapseTrigger>
      </CollapseHeader>
      <CollapseContent
        v-for="i in count"
        :key="i"
      >
        <div>
          Content {{ value }}
        </div>
      </CollapseContent>
    </CollapseItem>
  </CollapseRoot>
</template>
