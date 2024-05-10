<script setup lang="ts">
import {DestylerPrimitive} from '@destyler/primitive'
import {DestylerLabel} from '../src'
</script>

<template>
  <DestylerLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    Accept terms and conditions
  </DestylerLabel>
  <DestylerLabel />
  <DestylerLabel for="input" />
  <DestylerPrimitive as="template" data-parent-attr="" >
    <div data-child-attr>Child class</div>
  </DestylerPrimitive>
</template>
