<script setup lang="ts">
import { ref } from 'vue'
import { DestylerSwitchRoot, DestylerSwitchThump } from '../src'

const checked = ref(false)
</script>

<template>
  <p>{{ checked ? "checked" : "unchecked" }}</p>
  <div>
    <label for="airplane-mode">Airplane mode</label>
    <DestylerSwitchRoot id="airplane-mode" v-model:checked="checked" aria-label="Airplane mode" data-testId="root" name="test" value="true">
      <DestylerSwitchThump data-testId="thumb" />
    </DestylerSwitchRoot>
  </div>
</template>
