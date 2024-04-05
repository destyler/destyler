<script setup lang="ts">
const props = defineProps<{
  inStyle?: string
  name: string
}>()

</script>

<template>
  <div class="h-80 mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] text-dark dark:text-light">
    {{ $props.name }}
    <div class="w-full h-full flex items-center justify-center touch-none box-border" :style="props.inStyle">
      <slot />
    </div>
  </div>
</template>
