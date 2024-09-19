<script setup lang="ts">
import { QrCodeItem, QrCodeRoot } from '@destyler/qr-code'
</script>

<template>
  <QrCodeRoot value="https://elonehoo.me" bg="white">
    <QrCodeItem p="5" />
  </QrCodeRoot>
</template>
