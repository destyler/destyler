<script setup lang="ts">
import { QrCodeItem, QrCodeRoot } from 'destyler'
</script>

<template>
  <QrCodeRoot
    class="bg-white p-4 rounded-md shadow-md"
    value="https://destyler-dev.vercel.app/"
  >
    <QrCodeItem background-color="transparent" foreground-color="#000" />
  </QrCodeRoot>
</template>
