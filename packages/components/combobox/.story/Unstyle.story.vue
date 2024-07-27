<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxSeparator, ComboboxTrigger, ComboboxViewport } from '../src'

const v = ref('Apple')
const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']
</script>

<template>
  <Story title="Combobox/Unstyle" :layout="{ type: 'grid', width: '50%' }">
    <Variant title="unstyle">
      <ComboboxRoot v-model="v">
        <ComboboxAnchor>
          <ComboboxInput placeholder="Test" class="text-black" />
          <ComboboxTrigger>
            <Icon name="radix-icons:chevron-down" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxViewport>
            <ComboboxEmpty />

            <ComboboxGroup>
              <ComboboxLabel>
                Fruits
              </ComboboxLabel>

              <ComboboxItem
                v-for="(option, index) in options" :key="index"
                :value="option"
              >
                <ComboboxItemIndicator>
                  <Icon name="radix-icons:check" />
                </ComboboxItemIndicator>
                <span>
                  {{ option }}
                </span>
              </ComboboxItem>
              <ComboboxSeparator />
            </ComboboxGroup>

            <ComboboxGroup>
              <ComboboxLabel>
                Vegetables
              </ComboboxLabel>
              <ComboboxItem
                v-for="(option, index) in vegetables" :key="index"
                :value="option"
              >
                <ComboboxItemIndicator>
                  <Icon name="radix-icons:check" />
                </ComboboxItemIndicator>
                <span>
                  {{ option }}
                </span>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxRoot>
    </Variant>
  </Story>
</template>
