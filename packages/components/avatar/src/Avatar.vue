<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { DestylerAvatarProps } from './props'

defineOptions({
  name: 'DestylerAvatar',
})

const { src, alt, delayMs } = withDefaults(defineProps<DestylerAvatarProps>(), {
  delayMs: 600,
})

const canRender = ref(false)
let timeout: ReturnType<typeof setTimeout> | undefined

if (delayMs) {
  timeout = setTimeout(() => {
    canRender.value = true
    clearTimeout(timeout)
  }, delayMs)
}
else {
  canRender.value = true
}

onMounted(() => {
  imageInit(src!)
})

const imageLoadingStatus = ref<'loaded' | 'error'>()
function imageInit(src: string) {
  const image = new Image()
  image.src = src
  image.onload = () => {
    imageLoadingStatus.value = 'loaded'
  }
  image.onerror = () => {
    imageLoadingStatus.value = 'error'
  }
}
</script>

<template>
  <span
    destyler-avatar-root
  >
    <img
      v-if="imageLoadingStatus === 'loaded'"
      destyler-avatar-img
      :src="src"
      :alt="alt"
    >
    <span
      v-if="imageLoadingStatus !== 'loaded' && canRender"
      destyler-avatar-fallback
    >
      {{ fallback }}
    </span>
  </span>
</template>
