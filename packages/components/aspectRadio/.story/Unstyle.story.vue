<script setup lang="ts">
import { AspectRadio } from '../src'
</script>

<template>
  <Story title="Aspect Radio/Default" :layout="{ type: 'single', iframe: true }">
    <Variant title="unstyle">
      <div class=" w-full sm:w-[300px] overflow-hidden rounded-md">
        <AspectRadio :aspect-ratio="16 / 9">
          <img src="https://elonehoo.me/gallery/20_sun.jpg">
        </AspectRadio>
      </div>
    </Variant>
  </Story>
</template>
