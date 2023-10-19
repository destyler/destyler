<script setup lang="ts">
import { DestylerAvatar } from '@destyler/components/avatar/src'
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <DestylerAvatar src="/elonehoo.jpeg" />
    <DestylerAvatar src="empty.png" fallback-src="/elonehoo.jpeg" />
    <DestylerAvatar class="border border-solid border-#3c3c431f dark:border-#5454547a">
      H
    </DestylerAvatar>
  </div>
</template>

<style scoped>
[destyler="avatar"]{
  @apply w-32px h-32px;
  @apply flex justify-center items-center bg-white dark:bg-black overflow-hidden rounded-[50%];
}
</style>
