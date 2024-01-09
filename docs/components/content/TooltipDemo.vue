<script setup lang="ts">
import { DestylerTooltip } from '@destyler/tooltip/src/tooltip'
</script>

<template>
  <ClientOnly>
    <DestylerTooltip trigger="hover">
      <template #trigger>
        <ButtonDemo>Hover</ButtonDemo>
      </template>
      Add to library
    </DestylerTooltip>
  </ClientOnly>
</template>

<style>
[destyler="tooltip-body-toggle"]{
  position: fixed;
  left: 0px;
  top: 0px;
  transform: translate(calc(var(--destyler-follower-x) - 2rem), calc(var(--destyler-follower-y) - var(--destyler-follower-height) - 1.75rem));
  min-width: max-content;
  border-width: 1px;
  border-radius: 0.375rem;
  width: 8rem;
  color:#09090b;
  padding: 1rem;
  --un-shadow: var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgb(0 0 0 / 0.1)), var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
  gap: 1rem;
  display: grid;
  background-color: white;
}
.dark [destyler="tooltip-body-toggle"]{
  color:#fafafa;
  border-color: #27272a;
  background-color: black;
}
</style>
