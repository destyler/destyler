<script setup lang="ts">
import { QrCodeItem, QrCodeRoot } from '@destyler/qr-code'
</script>

<template>
  <QrCodeRoot value="https://elonehoo.me" class="bg-white">
    <QrCodeItem class="p-5" />
  </QrCodeRoot>
</template>
