<script setup lang="ts">
import { DestylerPrimitive } from 'destyler'
</script>

<template>
  <DestylerPrimitive id="parent" as="template" data-type="button">
    <div id="child" data-type="primary">
      Child class
    </div>
  </DestylerPrimitive>
</template>
