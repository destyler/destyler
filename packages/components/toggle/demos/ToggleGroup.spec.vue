<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from '../src'

const toggleStateSingle = ref('center')
</script>

<template>
  <ToggleGroupRoot v-model="toggleStateSingle" class="flex">
    <ToggleGroupItem
      value="left"
      aria-label="Toggle italic"
    >
      <svg>
        <path />
      </svg>
    </ToggleGroupItem>
    <ToggleGroupItem
      value="center"
      aria-label="Toggle italic"
    >
      <svg>
        <path />
      </svg>
    </ToggleGroupItem>
    <ToggleGroupItem
      value="right"
      aria-label="Toggle italic"
    >
      <svg>
        <path />
      </svg>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
