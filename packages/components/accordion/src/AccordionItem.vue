<script setup lang="ts">
import { selected } from './composition'

defineOptions({
  name: 'DestylerAccordionItem',
})
</script>

<template>
  <div>
    <div accordion-item-header>
      <slot name="header" />
    </div>
    <div v-show="selected" accordion-item-content>
      <slot name="conter" />
    </div>
  </div>
</template>
