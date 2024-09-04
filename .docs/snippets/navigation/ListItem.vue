<script setup lang="ts">
import { NavigationLink } from '@destyler/navigation'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <li>
    <NavigationLink class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
      <div class="text-sm font-medium leading-none">
        {{ props.title }}
      </div>
      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
        <slot />
      </p>
    </NavigationLink>
  </li>
</template>

<style scoped>
li::before {
  @apply content-none!;
}

a{
  @apply border-none!;
}
</style>
