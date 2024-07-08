<script setup lang="ts">
import ButtonDemo from '~/components/button/demos/Button.demo.vue'
</script>

<template>
  <Story
    title="Button/button"
    :layout="{ type: 'grid', width: '50%' }"
    auto-props-disabled
  >
    <Variant title="Closed by default">
      <ButtonDemo />
    </Variant>
</Story>
</template>
