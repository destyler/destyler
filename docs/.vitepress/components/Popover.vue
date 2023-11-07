<script setup lang="ts">
import { DestylerPopover } from '@destyler/components/popover/src'
import { DestylerButton } from '@destyler/components/button/src'
</script>

<template>
  <DestylerPopover trigger="hover">
    <template #trigger>
      <DestylerButton class="btn-green!">
        Hover
      </DestylerButton>
    </template>
    <span>Maybe I don't really want to know how your garden grows</span>
  </DestylerPopover>
</template>

<style>
[destyler="follower"]{
  position: fixed;
  left: 0px;
  top: 0px;
  transform: translate(var(--destyler-follower-x), calc(var(--destyler-follower-y) - var(--destyler-follower-height)));
}
</style>
