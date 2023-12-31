<script setup lang="ts">
import { DestylerTooltip } from '@destyler/tooltip/src/tooltip'
</script>

<template>
  <DestylerTooltip trigger="click">
    <template #trigger>
      <ButtonDemo> Duck </ButtonDemo>
    </template>
    If it looks like a duck, walks like a duck, and quacks like a duck...it must
    be a duck.
  </DestylerTooltip>
</template>
