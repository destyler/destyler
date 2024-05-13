<script setup lang="ts">
import { ref } from 'vue'
import { DestylerRadioGroupIndicator, DestylerRadioGroupItem, DestylerRadioGroupRoot } from '../src'

const radioStateSingle = ref('default')
</script>

<template>
  <DestylerRadioGroupRoot
    v-model="radioStateSingle"
    :loop="false"
    aria-label="View density"
    orientation="vertical"
  >
    <div>
      <DestylerRadioGroupItem
        id="r1"
        aria-label="Default"
        value="default"
      >
        <DestylerRadioGroupIndicator />
      </DestylerRadioGroupItem>
      <label for="r1">
        Default
      </label>
    </div>
    <div>
      <DestylerRadioGroupItem
        id="r2"
        aria-label="Comfortable"
        disabled
        value="comfortable"
      >
        <DestylerRadioGroupIndicator />
      </DestylerRadioGroupItem>
      <label for="r2">
        Comfortable
      </label>
    </div>
    <div>
      <DestylerRadioGroupItem
        id="r3"
        aria-label="Compact"
        as-child
        value="compact"
      >
        <button>
          <DestylerRadioGroupIndicator />
        </button>
      </DestylerRadioGroupItem>
      <label for="r3">
        Compact
      </label>
    </div>
  </DestylerRadioGroupRoot>
</template>
