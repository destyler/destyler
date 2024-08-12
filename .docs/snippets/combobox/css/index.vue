<script setup lang="ts">
// @noErrors
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxSeparator, ComboboxTrigger, ComboboxViewport } from '@destyler/combobox'
import './style.css'

const value = ref('')

const options = ref([
  {
    label: 'frontend',
    items: ['vue', 'nuxt', 'react', 'next', 'svelte', 'svelte kit', 'angular'],

  },
  {
    label: 'backend',
    items: ['nitro', 'express', 'hono', 'koa', 'adonis'],
  },
])
</script>

<template>
  <ComboboxRoot
    v-model="value"
    class="comboboxRoot"
  >
    <ComboboxAnchor class="comboboxAnchor">
      <ComboboxInput
        class="comboboxInput"
        placeholder="Placeholder..."
      />
      <ComboboxTrigger class="comboboxTrigger">
        <Icon
          class="icon"
          name="carbon:chevron-down"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent
      class="comboboxContent"
    >
      <ComboboxViewport>
        <ComboboxEmpty class="comboboxEmpty" />
        <template
          v-for="(option, index) of options"
          :key="option.label"
        >
          <ComboboxGroup class="comboboxGroup">
            <ComboboxLabel
              class="comboboxLabel"
            >
              {{ option.label }}
            </ComboboxLabel>
            <ComboboxItem
              v-for="item in option.items"
              :key="item"
              :value="item"
              class="comboboxItem"
            >
              <span>{{ item }}</span>
              <ComboboxItemIndicator class="comboboxItemIndicator">
                <Icon name="carbon:checkmark" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator v-show="index !== options.length - 1" class="comboboxSeparator" />
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
