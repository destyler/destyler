# @destyler/accordion

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DestylerAccordionItem, DestylerAccordionRoot } from '@destyler/accordion'

const selected = ref('item1')

const items = [
  {
    title: 'Item 1',
    value: 'item1',
    content: 'Item 1.Item 1.Item 1',
  },
  {
    title: 'Item 2',
    value: 'item2',
    content: 'Item 2.Item 2.Item 2',
  },
  {
    title: 'Item 3',
    value: 'item3',
    content: 'Item 3.Item 3.Item 3',
  },
]
</script>

<template>
  <DestylerAccordionRoot v-model="selected">
    <DestylerAccordionItem v-for="item in items" :key="item.value" :value="item.value">
      <template #header>
        {{ item.title }}
      </template>
      <template #conter>
        {{ item.content }}
      </template>
    </DestylerAccordionItem>
  </DestylerAccordionRoot>
</template>
```

## Anatomy

```vue
<script setup lang="ts">
import { DestylerAccordionItem, DestylerAccordionRoot } from '@destyler/accordion'
</script>

<template>
  <DestylerAccordionRoot>
    <DestylerAccordionItem>
      <template #header />
      <template #conter />
    </DestylerAccordionItem>
  </DestylerAccordionRoot>
</template>
```

## API Reference

### DestylerAccordionRoot

#### Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `v-model` | `string` | true | `null` | The value of the selected item. |

#### Slots

| Name | Description |
| --- | --- |
| `default` | The accordion items. |

### DestylerAccordionItem

#### Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | true | `null` | The value of the item. |
| `disabled` | `boolean` | false | `false` | Whether the item is disabled. |

#### Slots

| Name | Description |
| --- | --- |
| `header` | The header of the item. |
| `content` | The content of the item. |
