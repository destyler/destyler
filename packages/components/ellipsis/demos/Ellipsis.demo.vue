<script setup lang="ts">
import { DestylerEllipsisContent, DestylerEllipsisPortal, DestylerEllipsisProvider, DestylerEllipsisRoot, DestylerEllipsisTrigger } from '../src'
</script>

<template>
  <DestylerEllipsisProvider>
    <DestylerEllipsisRoot>
      <DestylerEllipsisTrigger class="max-w-240px">
        住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪
      </DestylerEllipsisTrigger>
      <DestylerEllipsisPortal>
        <DestylerEllipsisContent
          :side-offset="5"
        />
      </DestylerEllipsisPortal>
    </DestylerEllipsisRoot>
  </DestylerEllipsisProvider>
</template>
