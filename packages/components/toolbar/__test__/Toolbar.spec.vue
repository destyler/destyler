<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import {
  ToolbarButton,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '../src'

const toggleStateSingle = ref('center')
const toggleStateMultiple = ref([])
</script>

<template>
  <ToolbarRoot
    aria-label="Formatting options"
  >
    <ToolbarToggleGroup
      v-model="toggleStateMultiple"
      type="multiple"
      aria-label="Text formatting"
    >
      <ToolbarToggleItem
        value="bold"
        aria-label="Bold"
      >
        <Icon name="radix-icons:font-bold" />
      </ToolbarToggleItem>
      <ToolbarToggleItem
        value="italic"
        aria-label="Italic"
      >
        <Icon name="radix-icons:font-italic" />
      </ToolbarToggleItem>
      <ToolbarToggleItem
        value="strikethrough"
        aria-label="Strike through"
      >
        <Icon name="radix-icons:strikethrough" />
      </ToolbarToggleItem>
    </ToolbarToggleGroup>
    <ToolbarSeparator />
    <ToolbarToggleGroup
      v-model="toggleStateSingle"
      type="single"
      aria-label="Text Alignment"
    >
      <ToolbarToggleItem
        value="left"
        aria-label="Left Aligned"
      >
        <Icon name="radix-icons:text-align-left" />
      </ToolbarToggleItem>
      <ToolbarToggleItem
        value="center"
        aria-label="Center Aligned"
      >
        <Icon name="radix-icons:text-align-center" />
      </ToolbarToggleItem>
      <ToolbarToggleItem
        value="right"
        aria-label="Right Aligned"
      >
        <Icon name="radix-icons:text-align-right" />
      </ToolbarToggleItem>
    </ToolbarToggleGroup>
    <ToolbarSeparator />
    <ToolbarLink
      href="#"
      target="_blank"
      style="margin-right: 10"
    >
      Edited 2 hours ago
    </ToolbarLink>
    <ToolbarButton
      style="margin-left: auto"
    >
      Share
    </ToolbarButton>
  </ToolbarRoot>
</template>
