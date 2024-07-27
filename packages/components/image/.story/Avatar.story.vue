<script setup lang="ts">
import { computed, ref } from 'vue'
import { Image, ImageFallback, ImageRoot } from '../src'

const PROFILES = [
  {
    src: 'https://github.com/elonehoo.png',
    alt: 'Elone Hoo',
    fallback: 'EH',
  },
  {
    src: '',
    alt: '',
    fallback: 'AD',
  },
]
const index = ref(0)
const profile = computed(() => {
  return PROFILES[index.value]
})
function rotateIndex() {
  if (index.value)
    index.value = 0
  else
    index.value = 1
}
</script>

<template>
  <Story title="Image/Image">
    <Variant title="default">
      <ImageRoot
        class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
      >
        <Image
          class="h-full w-full rounded-[inherit] object-cover"
          src="https://github.com/elonehoo.png"
          alt="Elone Hoo"
        />
        <ImageFallback
          class="text-green11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
          :delay-ms="600"
        >
          EH
        </ImageFallback>
      </ImageRoot>
      <ImageRoot
        class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
      >
        <Image
          class="h-full w-full rounded-[inherit] object-cover"
          src="https://github.com/antfu.png"
          alt="Anthony Fu"
        />
        <ImageFallback
          class="text-green11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
        >
          AF
        </ImageFallback>
      </ImageRoot>
      <ImageRoot
        class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
      >
        <Image
          class="h-full w-full rounded-[inherit] object-cover"
          src="https://github.com/yyx990803.png"
          alt="Evan You"
        />
        <ImageFallback
          class="text-green11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
        >
          EY
        </ImageFallback>
      </ImageRoot>
      <ImageRoot
        class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
      >
        <ImageFallback
          class="text-green11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
        >
          ET
        </ImageFallback>
      </ImageRoot>
      <ImageRoot
        class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
        @click.prevent="rotateIndex"
      >
        <Image
          class="h-full w-full rounded-[inherit] object-cover"
          :src="profile.src"
          :alt="profile.alt"
        />
        <ImageFallback
          class="text-green11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
          :delay-ms="600"
        >
          {{ profile.fallback }}
        </ImageFallback>
      </ImageRoot>
    </Variant>
  </Story>
</template>
