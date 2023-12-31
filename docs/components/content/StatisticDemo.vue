<script setup lang="ts">
import { DestylerStatistic } from '@destyler/statistic/src/statistic'
</script>

<template>
  <DestylerStatistic label="Active Users">
    1,234,123
  </DestylerStatistic>
</template>

<style>
[destyler="statistic-label"]{
  --un-text-opacity: 0.6;
  color: rgb(9 9 11 / var(--un-text-opacity));
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.dark [destyler="statistic-label"]{
  --un-text-opacity: 0.6;
  color: rgb(250 250 250 / var(--un-text-opacity));
}
[destyler="statistic-value"]{
  font-size: 1.875rem;
  line-height: 2.25rem;
}
</style>
