<script setup lang="ts">
import { DestylerStatistic } from '@destyler/components/statistic/src'
</script>

<template>
  <DestylerStatistic label="统计数据" :value="99" >
    <template #suffix>
      / 100
    </template>
  </DestylerStatistic>
</template>

<style>

</style>
