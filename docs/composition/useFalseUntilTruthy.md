# useFalseUntilTruthy

It's `false` until `arg` value is truthy. Then it will be `true`.

```typescript
function useFalseUntilTruthy (arg: Ref<any>): Readonly<Ref<boolean>>
```

<script setup>
import UseFalseUntilTruthy from '../.vitepress/components/UseFalseUntilTruthy.vue'
</script>

<Showcase title="useFalseUntilTruthy" >
  <UseFalseUntilTruthy />
</Showcase>

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFalseUntilTruthy } from '@destyler/composition'

const inputText = ref<string>('')
const result = ref(useFalseUntilTruthy(inputText).value)
watch(inputText, () => {
  result.value = useFalseUntilTruthy(inputText).value
})
</script>

<template>
  <div>
    <input v-model="inputText" class="input-green" type="text">
    <div class="badge-green mt-2">
      {{ result }}
    </div>
  </div>
</template>
```
