---
layout: docs
composition: true
---

# useId

> Generate random id

## Install

<CodeGroupPackage name="@destyler/composition" />

## Usage

<CodePreview :tabs="[
  {value: 'ts', label: 'index.ts', icon: 'vscode-icons:file-type-typescript'},
]">

<template #ts>

```ts
import { useId } from '@destyler/composition'

const id = useId() // destyler-1

const buttonId = useId('test-id') // test-id-1
```

</template>

</CodePreview>
