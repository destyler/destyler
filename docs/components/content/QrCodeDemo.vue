<script setup lang="ts">
import { DestylerQrCodeItem, DestylerQrCodeRoot } from 'destyler'
</script>

<template>
  <DestylerQrCodeRoot
    class="bg-white p-4 rounded-md shadow-md"
    value="https://destyler-dev.vercel.app/"
  >
    <DestylerQrCodeItem background-color="transparent" foreground-color="#000" />
  </DestylerQrCodeRoot>
</template>
