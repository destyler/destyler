<script setup lang="ts">
import { DestylerAvatarFallback, DestylerAvatarImage, DestylerAvatarRoot } from 'destyler'
</script>

<template>
  <DestylerAvatarRoot>
    <DestylerAvatarImage
      src="https://github.com/elonehoo.png"
      alt="Elone Hoo"
    />
    <DestylerAvatarFallback
      :delay-ms="600"
    >
      EH
    </DestylerAvatarFallback>
  </DestylerAvatarRoot>
</template>
