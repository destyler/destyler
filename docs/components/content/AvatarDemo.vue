<script setup lang="ts">
import { DestylerAvatar } from '@destyler/avatar/src/avatar'
</script>

<template>
  <DestylerAvatar src="https://elonehoo.me/avatar.png" />
</template>

<style>
[destyler="avatar"]{
  position: relative;
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
}
[destyler="avatar-img"]{
  aspect-ratio: 1/1;
  height: 100%;
  width: 100%;
}
</style>
