<script setup lang="ts">
// @noErrors
import { Button } from '@destyler/button'
</script>

<template>
  <Button
    inline="flex"
    items="center"
    justify="center"
    whitespace="nowrap"
    rounded="md"
    text="sm primary-foreground"
    font="medium"
    transition="colors"
    shadow="sm"
    h="9"
    p="x-4 y-2"
    focus-visible="outline-none ring-1"
    bg="primary hover:primary/90"
    op="disabled:50"
    pointer-events="disabled:none"
  >
    Button
  </Button>
</template>
