<script setup lang="ts">
import { Radio } from '../src/component'
</script>

<template>
  <div>
    <Radio
      id="r1"
      aria-label="Default"
      value="true"
      name="test"
    />
    <label for="r1">
      Default
    </label>
  </div>
</template>
