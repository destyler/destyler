<script setup lang="ts">
import { DestylerRadio } from '../src/component'
</script>

<template>
  <div>
    <DestylerRadio
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
