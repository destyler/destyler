<script setup lang="ts">
import { DestylerPopover } from '@destyler/components/popover/src'
import { DestylerButton } from '@destyler/components/button/src'
</script>

<template>
  <DestylerPopover trigger="hover" display-directive="if">
    <template #trigger>
      <span>Hover</span>
    </template>
    <template #header>
      i am header
    </template>
    <template #footer>
      i am footer
    </template>
    <span>Maybe I don't really want to know how your garden grows</span>
  </DestylerPopover>
</template>

<style>
[destyler="follower"]{
  position: fixed;
  left: 0px;
  top: 0px;
  transform: translate(var(--destyler-follower-x), 100px);
}
</style>
