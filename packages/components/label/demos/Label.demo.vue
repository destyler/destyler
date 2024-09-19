<script setup lang="ts">
import { Primitive } from '@destyler/primitive'
import { Label } from '../src'
</script>

<template>
  <Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    Accept terms and conditions
  </Label>
  <Label />
  <Label for="input" />
  <Primitive as="template" data-parent-attr="">
    <div data-child-attr>
      Child class
    </div>
  </Primitive>
</template>
