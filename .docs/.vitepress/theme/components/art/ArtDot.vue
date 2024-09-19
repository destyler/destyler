<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useEventListener, useWindowSize } from '@vueuse/core'

const el = ref<HTMLCanvasElement | null>(null)

const { width, height } = useWindowSize()

const unmounted = ref()

onMounted(() => {
  import('p5i').then(({ p5i }) => {
    const {
      mount,
      unmount,
      createCanvas,
      background,
      noFill,
      stroke,
      noise,
      noiseSeed,
      resizeCanvas,
      cos,
      sin,
      TWO_PI,
    } = p5i()

    let w = width.value + 10
    let h = height.value + 10
    const offsetY = window.scrollY

    const SCALE = 200
    const LENGTH = 10
    const SPACING = 15

    function getForceOnPoint(x: number, y: number, z: number) {
      // https://p5js.org/reference/#/p5/noise
      return (noise(x / SCALE, y / SCALE, z) - 0.5) * 2 * TWO_PI
    }

    const existingPoints = new Set<string>()
    const points: { x: number, y: number, opacity: number }[] = []

    function addPoints() {
      for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
        for (let y = -SPACING / 2; y < h + offsetY + SPACING; y += SPACING) {
          const id = `${x}-${y}`
          if (existingPoints.has(id))
            continue
          existingPoints.add(id)
          points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 })
        }
      }
    }

    function setup() {
      createCanvas(w, h)
      background('#FFFFFF')
      stroke('#CCC')
      noFill()

      noiseSeed(+new Date())

      addPoints()
    }

    function draw({ circle }) {
      background('#FFFFFF')
      const t = +new Date() / 10000

      for (const p of points) {
        const { x, y } = p
        const rad = getForceOnPoint(x, y, t)
        const length = (noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH
        const nx = x + cos(rad) * length
        const ny = y + sin(rad) * length
        stroke(200, 200, 200, (Math.abs(cos(rad)) * 0.8 + 0.2) * p.opacity * 255)
        circle(nx, ny - offsetY, 1)
      }
    }

    function restart() {
      if (el.value)
        mount(el.value, { setup, draw })
    }

    nextTick(() => {
      restart()

      useEventListener('resize', () => {
        w = window.innerWidth + 10
        h = window.innerHeight + 10
        resizeCanvas(w, h)
        addPoints()
      })

      unmounted.value = unmount
    })
  })
})

onUnmounted(() => {
  unmounted.value()
})
</script>

<template>
  <div ref="el" class="z--1 fixed left-0 right-0 top-0 bottom-0 pointer-events-none dark:invert" />
</template>
