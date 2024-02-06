<script setup lang="ts">
import { DestylerBackTop, DestylerIcon } from 'destyler'
</script>

<template>
  <div class="">
    <DestylerBackTop
      class="fixed bottom-3 flex justify-center items-center w-10 h-10 op30 hover:op100 rounded-full hover-bg-hex-8883 transition duration-300 z-100 print:hidden"
    >
      <DestylerIcon name="radix-icons:arrow-up" />
    </DestylerBackTop>
  </div>
</template>
