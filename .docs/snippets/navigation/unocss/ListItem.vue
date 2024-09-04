<script setup lang="ts">
import { NavigationLink } from '@destyler/navigation'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <li>
    <NavigationLink
      block="~"
      select="none"
      space="y-1"
      rounded="md"
      p="3"
      leading="none"
      no-underline="~"
      outline="none"
      transition="colors"
      bg="hover:accent focus:accent"
      text="hover:accent-foreground focus:accent-foreground"
      cursor="pointer"
    >
      <div
        text="sm"
        font="medium"
        leading="none"
      >
        {{ props.title }}
      </div>
      <p
        line-clamp="2"
        text="sm muted-foreground"
        leading="snug"
      >
        <slot />
      </p>
    </NavigationLink>
  </li>
</template>
