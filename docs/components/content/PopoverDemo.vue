<script setup lang="ts">
import { DestylerPopover } from '@destyler/popover/src/popover'

const data = ref([
  { label: 'Width', value: '100%' },
  { label: 'Max.width', value: '300px' },
  { label: 'Height', value: '25px' },
  { label: 'Max.height', value: 'none' },
])
</script>

<template>
  <DestylerPopover trigger="click">
    <template #trigger>
      <ButtonDemo>
        Open popover
      </ButtonDemo>
    </template>
    <template #header>
      <div class="space-y-2">
        <h4 class="font-medium leading-none">
          Dimensions
        </h4>
        <p class="text-sm text-#09090b dark:text-#fafafa text-op-60">
          Set the dimensions for the layer.
        </p>
      </div>
    </template>
    <div class="grid gap-2">
      <div v-for="item in data" :key="item.label" class="grid grid-cols-3 items-center gap-4">
        <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ item.label }}</label>
        <input id="width" class="flex w-full rounded-md border border-#e4e4e7 dark:border-#27272a bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium text-#09090b dark:text-#fafafa text-op-60! focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 col-span-2 h-8" :value="item.value">
      </div>
    </div>
  </DestylerPopover>
</template>

<style>
[destyler="popover-body-toggle"]{
  position: fixed;
  left: 0px;
  top: 0px;
  transform: translate(calc(var(--destyler-follower-x) - 5rem), calc(var(--destyler-follower-y) + var(--destyler-follower-height) + 0.25rem));
  min-width: max-content;
  border-width: 1px;
  border-radius: 0.375rem;
  width: 20rem;
  color:#09090b;
  padding: 1rem;
  --un-shadow: var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgb(0 0 0 / 0.1)), var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
  gap: 1rem;
  display: grid;
  background-color: white;
}
.dark [destyler="popover-body-toggle"]{
  color:#fafafa;
  border-color: #27272a;
  background-color: black;
}
</style>
