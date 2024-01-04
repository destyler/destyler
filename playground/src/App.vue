<script setup lang="ts">
import { DestylerOnline } from '@destyler/components/online/src/online'
</script>

<template>
  <DestylerOnline v-slot="{ online }">
    {{ online }}
  </DestylerOnline>
</template>

<style>

</style>
