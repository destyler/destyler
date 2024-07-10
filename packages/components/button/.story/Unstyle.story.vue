<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '../src'

const count = ref(0)

function handle() {
  count.value++
}
</script>

<template>
  <Story
    title="Button/Default"
  >
    <Variant title="unstyle">
      {{ count }}
      <Button @click="handle">
        Button
      </Button>
    </Variant>
  </Story>
</template>
