<script setup lang="ts">
defineOptions({
  name: 'DestylerCheckbox',
})

const modelValue = defineModel<boolean>({ required: true })

function handleClick() {
  modelValue.value = !modelValue.value
}
</script>

<template>
  <button destyler-checkbox-root @click="handleClick">
    <span v-if="modelValue" destyler-checkbox-item>
      <slot />
    </span>
  </button>
</template>
