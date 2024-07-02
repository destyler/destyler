<script setup lang="ts">
import { PreviewDialog, PreviewRoot } from '../src'
</script>

<template>
  <PreviewRoot :max-width="2000">
    <PreviewDialog />
    <img src="https://elonehoo.me/gallery/21_tree.jpg">
  </PreviewRoot>
</template>
