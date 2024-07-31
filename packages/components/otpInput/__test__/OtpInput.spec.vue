<script setup lang="ts">
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { OtpInput, OtpInputRoot } from '../src'

const props = defineProps<{
  as?: any
  asChild?: any
  modelValue?: string[]
  defaultValue?: string[]
  placeholder?: string
  mask?: boolean
  otp?: boolean
  type?: string
  dir?: string
  name?: string
  disabled?: boolean
  required?: boolean
  id?: string
}>()
const emits = defineEmits(['update:modelValue', 'complete'])

const value = ref<string[]>([])
</script>

<template>
  <label for="otp">Test label</label>
  <OtpInputRoot
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    v-model="value"
  >
    <OtpInput
      v-for="(id, index) in 5"
      :key="id"
      :index="index"
    />
  </OtpInputRoot>
</template>
