<script setup lang="ts">
import { NavigationLink } from '../src'

const props = defineProps({
  title: String,
})
</script>

<template>
  <li>
    <NavigationLink as-child>
      <a
        v-bind="$attrs"
      >
        <div>
          {{ props.title }}
        </div>
        <p>
          <slot />
        </p>
      </a>
    </NavigationLink>
  </li>
</template>
