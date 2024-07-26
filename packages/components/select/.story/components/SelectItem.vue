<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { SelectItem, SelectItemIndicator, SelectItemText } from '../../src'

defineProps<{
  options: string[]
}>()
</script>

<template>
  <SelectItem
    v-for="(option, index) in options"
    :key="index"
    class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
    :value="option"
  >
    <SelectItemIndicator
      class="absolute left-0 w-[25px] inline-flex items-center justify-center"
    >
      <Icon name="radix-icons:check" />
    </SelectItemIndicator>
    <SelectItemText>
      {{ option }}
    </SelectItemText>
  </SelectItem>
</template>
