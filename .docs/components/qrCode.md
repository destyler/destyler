---
layout: docs
component: qrCode
---

# QR Code

> A component that generates a QR code based on the provided data.

<Preview name="qrCode" />

## Features

<Features :lists="[
  'Customize the size of the QR code in pixels',
  'Set the error correction level',
  'Customize the background and foreground color',
]" />

## Install

<CodeGroupPackage name="@destyler/qr-code" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  QrCodeItem,
  QrCodeRoot
} from '@destyler/qr-code'
</script>

<template>
  <QrCodeRoot>
    <QrCodeItem />
  </QrCodeRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/qrCode/.docs/root.md-->

### Item

<!--@include: ../../packages/components/qrCode/.docs/item.md-->
