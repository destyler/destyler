<script setup lang="ts">
import { NavigationLink } from '@destyler/navigation'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <li>
    <NavigationLink class="navigation-link">
      <div class="title">
        {{ props.title }}
      </div>
      <p class="desc">
        <slot />
      </p>
    </NavigationLink>
  </li>
</template>

<style scoped>
.navigation-link {
  display: block;
  user-select: none;
  margin-bottom: 0.25rem;
  border-radius: 0.375rem;
  padding: 0.75rem;
  line-height: 1;
  text-decoration: none;
  outline: none;
  transition: color 0.15s ease, background-color 0.15s ease;
  cursor: pointer;
}

.navigation-link:hover {
  background-color: rgb(var(--accent));
  color: rgb(var(--accent-foreground));
}

.navigation-link:focus {
  background-color: rgb(var(--accent));
  color: rgb(var(--accent-foreground));
}

.title {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}
.desc{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(var(muted-foreground));
}
</style>
