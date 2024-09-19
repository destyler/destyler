# @destyler/back-top

[![NPM version](https://img.shields.io/npm/v/@destyler/back-top?color=a1b858&label=)](https://www.npmjs.com/package/@destyler/back-top)

> it helps you back to where you were. However, time never goes back.

[GitHub](https://github.com/destyler/destyler) | [Documentation](https://destyler-dev.zeabur.app/)

## Install

```bash
npm install @destyler/back-top
```

## Usage

```vue
<script setup lang="ts">
import { BackTop } from '@destyler/back-top'
</script>

<template>
  <BackTop />
</template>
```

## Props

| name | description | type | required | default |
| --- | --- | --- | --- | --- |
| as | <p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p> | `AsTag` \| `Component` | false | button |
| asChild | <p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p><p>Read our Composition guide for more details.</p> | `boolean` | false | false |
| listen | <p>The element to be listened to scroll event.If it is <code>undefined</code> back top will listen to the nearest scrollable parent.</p> | `string \| HTMLElement \| Document \| (() => HTMLElement \| Document)` | false | undefined |
