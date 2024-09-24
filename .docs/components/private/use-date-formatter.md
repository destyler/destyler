---
layout: docs
composition: true
---

# useDateFormatter

> Creates a wrapper for DateFormatter, an enhanced version of the Intl.DateTimeFormat API, used internally by various date builders to format dates consistently.
>
> More information on the DateFormatter [here](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html).

## Install

<CodeGroupPackage name="@destyler/composition @destyler/shared @internationalized/date" />

## Usage

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'},
]">

<template #vue>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
import { useDateFormatter } from '@destyler/composition'
import { toDate } from '@destyler/shared'

const value = ref<DateValue>(new CalendarDate(2001, 9, 1))
const formatter = useDateFormatter('en')
</script>

<template>
  <span>
    {{ formatter.custom(value.toDate(getLocalTimeZone()), {
      month: 'short',
    }) }}
  </span>
</template>
```

</template>

</CodePreview>
