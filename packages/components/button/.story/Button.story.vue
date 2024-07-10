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
    title="Button/Demo"
  >
    <Variant title="default">
      {{ count }}
      <Button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-[#FAFAFA] dark:hover:bg-[#FAFAFA]/90 bg-[#18181B] hover:bg-[#18181B]/90 dark:text-[#18181B] text-[#FAFAFA] shadow h-9 px-4 py-2" @click="handle">
        Button
      </Button>
    </Variant>
  </Story>
</template>
