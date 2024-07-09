<script setup lang="ts">
import { Button } from '../src'

function handle() {
  console.log('click')
}
</script>

<template>
  <Story
    title="Button/Default"
  >
    <Variant title="unstyle">
      <Button @click="handle">
        Button
      </Button>
    </Variant>
  </Story>
</template>
