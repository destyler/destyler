<script setup lang="ts">
import { ref } from 'vue'
import { DestylerToggleGroupItem, DestylerToggleGroupRoot } from '../src'

const toggleStateSingle = ref('center')
</script>

<template>
  <DestylerToggleGroupRoot v-model="toggleStateSingle" class="flex">
    <DestylerToggleGroupItem
      value="left"
      aria-label="Toggle italic"
    >
      <svg>
        <path />
      </svg>
    </DestylerToggleGroupItem>
    <DestylerToggleGroupItem
      value="center"
      aria-label="Toggle italic"
    >
      <svg>
        <path />
      </svg>
    </DestylerToggleGroupItem>
    <DestylerToggleGroupItem
      value="right"
      aria-label="Toggle italic"
    >
      <svg>
        <path />
      </svg>
    </DestylerToggleGroupItem>
  </DestylerToggleGroupRoot>
</template>
