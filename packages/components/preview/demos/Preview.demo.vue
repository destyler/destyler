<script setup lang="ts">
import { DestylerPreviewDialog, DestylerPreviewRoot } from '../src'
</script>

<template>
  <DestylerPreviewRoot :max-width="2000">
    <DestylerPreviewDialog />
    <img src="https://elonehoo.me/gallery/21_tree.jpg">
  </DestylerPreviewRoot>
</template>
