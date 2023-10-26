<script setup lang="ts">
import { DestylerPopover } from '@destyler/components/popover/src'
import { DestylerButton } from '@destyler/components/button/src'
</script>

<template>
  <DestylerPopover trigger="hover">
    <template #trigger>
      <DestylerButton class="btn-green!">
        悬浮
      </DestylerButton>
    </template>
    <span>或许不想知道你的花园长得咋样</span>
  </DestylerPopover>
</template>
