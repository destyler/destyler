<script setup lang="ts">
import { AspectRadio } from '../src'
</script>

<template>
  <Story title="Aspect Radio/Demo" :layout="{ type: 'grid', width: '50%' }">
    <Variant title="default">
      <div class=" w-full sm:w-[300px] overflow-hidden rounded-md">
        <AspectRadio class="bg-#27272A" :aspect-ratio="16 / 9">
          <img src="https://elonehoo.me/gallery/20_sun.jpg" class="rounded-md object-cover absolute h-full w-full text-transparent inset-0">
        </AspectRadio>
      </div>
    </Variant>
  </Story>
</template>
