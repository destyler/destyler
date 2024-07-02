<script setup lang="ts">
import { EllipsisContent, EllipsisPortal, EllipsisProvider, EllipsisRoot, EllipsisTrigger } from '../src'
</script>

<template>
  <EllipsisProvider>
    <EllipsisRoot>
      <EllipsisTrigger class="max-w-240px">
        住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪
      </EllipsisTrigger>
      <EllipsisPortal>
        <EllipsisContent
          :side-offset="5"
        />
      </EllipsisPortal>
    </EllipsisRoot>
  </EllipsisProvider>
</template>
