<script setup lang="ts">
import {
  QrCodeItem,
  QrCodeRoot,
} from '../src'
</script>

<template>
  <Story title="QR Code/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <QrCodeRoot value="https://elonehoo.me">
        <QrCodeItem />
      </QrCodeRoot>
    </Variant>
  </Story>
</template>
