# @destyler/aspect-radio

[![NPM version](https://img.shields.io/npm/v/@destyler/aspect-radio?color=a1b858&label=)](https://www.npmjs.com/package/@destyler/aspect-radio)

> displays content within a desired ratio.

[GitHub](https://github.com/destyler/destyler) | [Documentation](https://destyler-dev.zeabur.app/components/aspectRadio)

## Install

```bash
npm install @destyler/aspect-radio
```

## Usage

```vue
<script setup lang="ts">
import { AspectRadio } from '@destyler/aspect-radio'
</script>

<template>
  <AspectRadio />
</template>
```

## Props

| name | description | type | required | default |
| --- | --- | --- | --- | --- |
| as | <p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p> | `AsTag` \| `Component` | false | div |
| asChild | <p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p><p>Read our Composition guide for more details.</p> | `boolean` | false | false |
| aspectRatio | <p>The desired ratio.</p> | `number` | false | 1 |

## Slots

| name | description | type |
| --- | --- | --- |
| aspect | <p>Current aspect ratio (in `%`)</p> | `number`
