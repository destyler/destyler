<script setup lang="ts">
import { ref } from 'vue'
import type { DestylerCheckboxRootProps } from '../src'
import { DestylerCheckboxIndicator, DestylerCheckboxRoot } from '../src'

const props = withDefaults(defineProps<DestylerCheckboxRootProps>(), {
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
  <DestylerCheckboxRoot
    v-bind="props"
    v-model:checked="checked"
    name="test"
    aria-label="Test"
  >
    <DestylerCheckboxIndicator
      data-testid="test-indicator"
    >
      <i icon="radix-icons:check" />
    </DestylerCheckboxIndicator>
  </DestylerCheckboxRoot>
</template>
