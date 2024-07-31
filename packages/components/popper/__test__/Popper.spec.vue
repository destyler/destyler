<script setup lang="ts">
import { PopperAnchor, PopperArrow, PopperContent, PopperRoot } from '../src'
</script>

<template>
  <PopperRoot>
    <PopperAnchor>
      Anchor
    </PopperAnchor>

    <PopperContent>
      Content

      <PopperArrow />
    </PopperContent>
  </PopperRoot>
</template>
