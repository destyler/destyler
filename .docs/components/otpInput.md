---
layout: docs
component: otpInput
---

# OTP Input

> A sequence of one-character alphanumeric inputs.

<Preview name="otpInput" />

## Features

<Features :lists="[
  'Full keyboard navigation.',
  'Can be controlled or uncontrolled.',
  'Supports pasting from clipboard',
  'Emit event when inputs were filled.',
]" />

## Install

<CodeGroupPackage name="@destyler/otp-input" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  OtpInput,
  OtpInputRoot,
} from '@destyler/otp-input'
</script>

<template>
  <OtpInputRoot>
    <OtpInput />
  </OtpInputRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/otpInput/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-complete]',
      value:`Present when completed`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    }
  ]"
/>

### Input

<!--@include: ../../packages/components/otpInput/.docs/input.md-->

<Attribute
  :value="[
    {
      name: '[data-complete]',
      value:`Present when completed`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    }
  ]"
/>
