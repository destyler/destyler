<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from '../src'

const radioStateSingle = ref('default')
</script>

<template>
  <RadioGroupRoot
    v-model="radioStateSingle"
    :loop="false"
    aria-label="View density"
    orientation="vertical"
  >
    <div>
      <RadioGroupItem
        id="r1"
        aria-label="Default"
        value="default"
      >
        <RadioGroupIndicator />
      </RadioGroupItem>
      <label for="r1">
        Default
      </label>
    </div>
    <div>
      <RadioGroupItem
        id="r2"
        aria-label="Comfortable"
        disabled
        value="comfortable"
      >
        <RadioGroupIndicator />
      </RadioGroupItem>
      <label for="r2">
        Comfortable
      </label>
    </div>
    <div>
      <RadioGroupItem
        id="r3"
        aria-label="Compact"
        as-child
        value="compact"
      >
        <button>
          <RadioGroupIndicator />
        </button>
      </RadioGroupItem>
      <label for="r3">
        Compact
      </label>
    </div>
  </RadioGroupRoot>
</template>
