<script setup lang="ts">
import {
  type Container,
  type ISourceOptions,
  tsParticles,
} from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    size: number
    minSize: number
    density: number
    speed: number
    minSpeed: number
    opacity: number
    minOpacity: number
    color: string
    background: string
    opacitySpeed: number
    options: ISourceOptions
  }>(),
  {
    id: () => `sparkles-${Math.round(Math.random() * 9999)}`,
    size: 1.2,
    minSize: 0.4,
    density: 1000,
    speed: 1,
    minSpeed: 0,
    opacity: 1,
    minOpacity: 0.1,
    color: '#FFFFFF',
    background: 'transparent',
    opacitySpeed: 3,
    options: () => ({}),
  },
)

let container: Container | undefined

const defaultOptions: ISourceOptions = {
  background: {
    color: {
      value: props.background,
    },
  },
  fullScreen: {
    enable: false,
    zIndex: 1,
  },
  fpsLimit: 120,
  particles: {
    color: {
      value: props.color,
    },
    move: {
      enable: true,
      direction: 'none',
      speed: {
        min: props.minSpeed || props.speed / 10,
        max: props.speed,
      },
      straight: false,
    },
    number: {
      value: props.density,
    },
    opacity: {
      value: {
        min: props.minOpacity || props.opacity / 10,
        max: props.opacity,
      },
      animation: {
        enable: true,
        sync: false,
        speed: props.speed,
      },
    },
    size: {
      value: {
        min: props.minSize || props.size / 2.5,
        max: props.size,
      },
    },
  },
  detectRetina: true,
}

onMounted(async () => {
  await loadSlim(tsParticles)

  const customOptions = props.options

  container = await tsParticles.load({
    id: props.id,
    options:
      Object.keys(customOptions).length > 0 ? customOptions : defaultOptions,
  })
})

onUnmounted(() => {
  if (!container) {
    return
  }

  container.destroy()
})
</script>

<template>
  <div :id="id" />
</template>
