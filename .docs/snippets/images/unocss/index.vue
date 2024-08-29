// @noErrors
<script setup lang="ts">
import { Image, ImageFallback, ImageRoot } from '@destyler/image'
</script>

<template>
  <ImageRoot
    relative="~"
    flex="~"
    h="10"
    w="10"
    shrink="0"
    overflow="hidden"
    rounded="full"
  >
    <Image
      aspect="square"
      h="full"
      w="full"
      src="https://github.com/destyler.png"
    />
    <ImageFallback
      flex="~"
      h="full"
      w="full"
      items="center"
      justify="center"
      rounded="full"
      bg="muted"
    >
      DE
    </ImageFallback>
  </ImageRoot>
</template>
