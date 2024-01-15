<script setup lang="ts">
import { DestylerAvatarFallback, DestylerAvatarImage, DestylerAvatarRoot } from '../src'

const props = defineProps<{
  src: string
}>()
</script>

<template>
  <DestylerAvatarRoot>
    <DestylerAvatarImage
      :src="props.src"
      alt="Elone Hoo"
    />
    <DestylerAvatarFallback
      :delay-ms="350"
    >
      EH
    </DestylerAvatarFallback>
  </DestylerAvatarRoot>
</template>
