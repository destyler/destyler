<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerToolbarButton,
  DestylerToolbarLink,
  DestylerToolbarRoot,
  DestylerToolbarSeparator,
  DestylerToolbarToggleGroup,
  DestylerToolbarToggleItem,
} from '../src'

const toggleStateSingle = ref('center')
const toggleStateMultiple = ref([])
</script>

<template>
  <DestylerToolbarRoot
    aria-label="Formatting options"
  >
    <DestylerToolbarToggleGroup v-model="toggleStateMultiple" type="multiple" aria-label="Text formatting">
      <DestylerToolbarToggleItem
        value="bold"
        aria-label="Bold"
      >
        <Icon icon="radix-icons:font-bold" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        value="italic"
        aria-label="Italic"
      >
        <Icon icon="radix-icons:font-italic" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        value="strikethrough"
        aria-label="Strike through"
      >
        <Icon icon="radix-icons:strikethrough" />
      </DestylerToolbarToggleItem>
    </DestylerToolbarToggleGroup>
    <DestylerToolbarSeparator />
    <DestylerToolbarToggleGroup v-model="toggleStateSingle" type="single" aria-label="Text Alignment">
      <DestylerToolbarToggleItem
        value="left"
        aria-label="Left Aligned"
      >
        <Icon icon="radix-icons:text-align-left" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        value="center"
        aria-label="Center Aligned"
      >
        <Icon icon="radix-icons:text-align-center" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        value="right"
        aria-label="Right Aligned"
      >
        <Icon icon="radix-icons:text-align-right" />
      </DestylerToolbarToggleItem>
    </DestylerToolbarToggleGroup>
    <DestylerToolbarSeparator />
    <DestylerToolbarLink
      href="#"
      target="_blank"
      style="margin-right: 10"
    >
      Edited 2 hours ago
    </DestylerToolbarLink>
    <DestylerToolbarButton
      style="margin-left: auto"
    >
      Share
    </DestylerToolbarButton>
  </DestylerToolbarRoot>
</template>
