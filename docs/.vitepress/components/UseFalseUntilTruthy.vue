<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFalseUntilTruthy } from '@destyler/composition/src'

const inputText = ref<string>('')
const result = ref(useFalseUntilTruthy(inputText).value)
watch(inputText, () => {
  result.value = useFalseUntilTruthy(inputText).value
})
</script>

<template>
  <div>
    <input v-model="inputText" class="input-green" type="text">
    <div class="badge-green mt-2">
      {{ result }}
    </div>
  </div>
</template>
