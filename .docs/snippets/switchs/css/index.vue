<script setup lang="ts">
import { ref } from 'vue'
import {
  SwitchRoot,
  SwitchThumb,
} from '@destyler/switch'
import { Label } from '@destyler/label'
import './style.css'

const value = ref(true)
</script>

<template>
  <div class="box">
    <SwitchRoot
      v-model:checked="value"
      class="switch-root"
    >
      <SwitchThumb
        class="switch-thumb"
      />
    </SwitchRoot>
    <Label class="label">
      Airplane Mode
    </Label>
  </div>
</template>
