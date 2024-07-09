<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { CheckboxIndicator, CheckboxRoot } from '../src'

const state = ref(true)
</script>

<template>
  <Story title="Checkbox/Demo">
    <Variant title="Unstyle">
      <CheckboxRoot v-model:checked="state">
        <CheckboxIndicator>
          <Icon name="i-ri-check-line" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <label htmlFor="terms">
        Accept terms and conditions
      </label>
    </Variant>
    <Variant title="Default">
      <CheckboxRoot
        v-model:checked="state"
        class="peer h-4 w-4 shrink-0 rounded-sm border border-[#18181B] dark:border-[#FAFAFA] shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#18181B] dark:data-[state=checked]:bg-[#FAFAFA] data-[state=checked]:text-[#FAFAFA] dark:data-[state=checked]:text-[#18181B]"
      >
        <CheckboxIndicator class="flex items-center justify-center text-current">
          <Icon name="i-ri-check-line" class="w-4 h-4" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <label
        htmlFor="terms"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-dark dark:text-light"
      >
        Accept terms and conditions
      </label>
    </Variant>
  </Story>
</template>
