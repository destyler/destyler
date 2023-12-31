<script setup lang="ts">
import { DestylerButton } from '@destyler/button/src/button'
</script>

<template>
  <DestylerButton>
    Button
  </DestylerButton>
</template>

<style>
[destyler="button"]{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition-property: color, background-color, border-color, outline-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  --un-shadow: var(--un-shadow-inset) 0 1px 3px 0 var(--un-shadow-color, rgb(0 0 0 / 0.1)), var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
  height: 2.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: #dedede;
  background-color: #18181b;
}
.dark [destyler="button"] {
  background-color: #fafafa;
  color: #18181b;
}
.dark [destyler="button"]:hover {
  background-color: #e2e2e2;
}
[destyler="button"]:hover{
  background-color: #2f2f31;
}
[destyler="button"]:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --un-ring-width: 1px;
  --un-ring-offset-shadow: var(--un-ring-inset) 0 0 0
    var(--un-ring-offset-width) var(--un-ring-offset-color);
  --un-ring-shadow: var(--un-ring-inset) 0 0 0
    calc(var(--un-ring-width) + var(--un-ring-offset-width))
    var(--un-ring-color);
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow),
    var(--un-shadow);
}
[destyler="button"]:disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
