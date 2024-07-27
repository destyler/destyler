<script setup lang="ts">
import { Divider } from '../src'
</script>

<template>
  <Story title="Divider/Default" :layout="{ type: 'single', iframe: true }">
    <Variant title="default">
      <div class="w-full max-w-[300px] mx-[15px]">
        <div class="text-white text-[15px] leading-5 font-medium">
          Destyler ui
        </div>
        <div class="text-white text-[15px] leading-5">
          unstyled component for vue.
        </div>
        <Divider
          decorative
          class="bg-green9 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]"
        />
        <div class="flex h-5 items-center">
          <div class="text-white text-[15px] leading-5">
            Blog
          </div>
          <Divider
            class="bg-green7 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
            decorative
            orientation="vertical"
          />
          <div class="text-white text-[15px] leading-5">
            Docs
          </div>
          <Divider
            class="bg-green7 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
            decorative
            orientation="vertical"
          />
          <div class="text-white text-[15px] leading-5">
            Source
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
