<script setup lang="ts">
import { DestylerTooltip } from '@destyler/components/tooltip/src'
import { DestylerButton } from '@destyler/components/button/src'
</script>

<template>
  <DestylerTooltip>
    <template #trigger>
      <DestylerButton class="btn-green!">
        悬浮
      </DestylerButton>
    </template>
    <span>或许不想知道你的花园长得咋样</span>
  </DestylerTooltip>
</template>

<style>
[destyler="follower"]{
  position: fixed;
  left: 0px;
  top: 0px;
  transform: translate(var(--destyler-follower-x), calc(var(--destyler-follower-y) + var(--destyler-follower-height)));
}
</style>
