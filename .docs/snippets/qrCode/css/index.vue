<script setup lang="ts">
import { QrCodeItem, QrCodeRoot } from '@destyler/qr-code'
import './style.css'
</script>

<template>
  <QrCodeRoot value="https://elonehoo.me" class="root">
    <QrCodeItem class="item" />
  </QrCodeRoot>
</template>
