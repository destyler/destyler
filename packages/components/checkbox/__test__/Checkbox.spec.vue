<script setup lang="ts">
import { ref } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from '../src'

const props = withDefaults(defineProps<{
  checked?: boolean | 'indeterminate' | undefined
  name?: string | undefined
  defaultChecked?: boolean | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
  value?: string | undefined
  id?: string | undefined
}>(), {
  checked: undefined,
})
const checked = ref(props.checked)
</script>

<template>
  <label
    for="test"
  >
    Test
  </label>
  <CheckboxRoot
    v-bind="props"
    v-model:checked="checked"
    name="test"
    aria-label="Test"
  >
    <CheckboxIndicator
      data-testid="test-indicator"
    />
  </CheckboxRoot>
</template>
