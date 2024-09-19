<script setup lang="ts">
import { ref } from 'vue'
import { Toggle } from '@destyler/toggle'
import { Icon } from '@destyler/icon'
import './style.css'

const value = ref(true)
</script>

<template>
  <Toggle
    v-model:pressed="value"
    class="toggle"
  >
    <Icon name="carbon:text-font" class="icon" />
  </Toggle>
</template>
