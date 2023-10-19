<script setup lang="ts">
import { DestylerAvatar } from '@destyler/components/avatar/src'
import { DestylerIcon } from '@destyler/components/icon/src'
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <DestylerAvatar src="/elonehoo.jpeg" />
    <DestylerAvatar src="empty.png" fallback-src="/elonehoo.jpeg" />
    <DestylerAvatar class="border border-solid border-#3c3c431f dark:border-#5454547a">
      H
    </DestylerAvatar>
    <DestylerAvatar class="border border-solid border-#3c3c431f dark:border-#5454547a">
      <DestylerIcon name="i-carbon-session-border-control" />
    </DestylerAvatar>
  </div>
</template>

<style scoped>
[destyler="avatar"]{
  @apply w-32px h-32px;
  @apply flex justify-center items-center bg-white dark:bg-black overflow-hidden rounded-1/2 inline-flex relative;
}
[destyler="avatar"] :deep([destyler="avatar-text"]){
  white-space: nowrap;
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
}
</style>
