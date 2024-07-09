<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { CheckboxIndicator, CheckboxRoot } from '../src'

const checkboxOne = ref<boolean | 'indeterminate'>('indeterminate')
const checkboxThree = ref(false)
</script>

<template>
  <Story title="Checkbox/Default">
    <Variant title="unstyle">
      <div class="flex flex-col">
        <label>
          <CheckboxRoot v-model:checked="checkboxOne">
            <CheckboxIndicator>
              <Icon v-if="checkboxOne === 'indeterminate'" name="radix-icons:divider-horizontal" />
              <Icon v-else-if="checkboxOne" name="radix-icons:check" />
            </CheckboxIndicator>
          </CheckboxRoot>
          <span>Checkbox</span>
        </label>
        <label>
          <CheckboxRoot disabled>
            <CheckboxIndicator>
              <Icon name="radix-icons:check" />
            </CheckboxIndicator>
          </CheckboxRoot>
          <span>Disabled Checkbox</span>
        </label>
        <label>
          <CheckboxRoot v-model:checked="checkboxThree" required>
            <CheckboxIndicator>
              <Icon name="radix-icons:check" class="h-3 w-3 text-black" />
            </CheckboxIndicator>
          </CheckboxRoot>
          <span>Required Checkbox</span>
        </label>
      </div>
    </Variant>
  </Story>
</template>
