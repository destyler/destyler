# @destyler/arrow

[![NPM version](https://img.shields.io/npm/v/@destyler/arrow?color=a1b858&label=)](https://www.npmjs.com/package/@destyler/arrow)

> destyler is private component arrow

[GitHub](https://github.com/destyler/destyler) | [Documentation](https://destyler-dev.zeabur.app/)

## Install

```bash
npm install @destyler/arrow
```

## Usage

```vue
<script setup lang="ts">
import { Arrow } from '@destyler/arrow'
</script>

<template>
  <Arrow />
</template>
```

## Props

| name | description | type | required | default |
| --- | --- | --- | --- | --- |
| as | <p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n | AsTag \| Component | false | svg |
| asChild | <p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n | boolean | false | false |
| height | <p>The height of the arrow in pixels.</p>\n | number | false | 5 |
| width | <p>The width of the arrow in pixels.</p>\n | number | false | 10 |
