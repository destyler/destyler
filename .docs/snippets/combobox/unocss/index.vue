<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from '@destyler/combobox'

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
    relative="~"
  >
    <ComboboxAnchor
      flex="~"
      h="9"
      w="full"
      rounded="md"
      border="~ input file:0"
      bg="transparent file:transparent"
      p="x-1"
      text="sm file:sm placeholder:muted-foreground"
      shadow="sm"
      transition="colors"
      font="file:medium"
      focus-visible="outline-none ring-1 ring-ring"
      disabled="cursor-not-allowed op-50"
    >
      <ComboboxInput
        bg="transparent"
        text="primary"
        w="full"
        outline="none"
        m="l-2"
        placeholder="Placeholder..."
      />
      <ComboboxTrigger rotate="[&[data-state=open]>svg]:180">
        <Icon
          w="4"
          h="4"
          text="primary/80"
          transition="transform"
          duration="150"
          name="carbon:chevron-down"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent
      absolute="~"
      z="10"
      m="t-1"
      w="full"
      rounded="md"
      border="~"
      bg="popover"
      p="1"
      text="popover-foreground"
      shadow="md"
      outline="none"
      class="
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0
      data-[state=open]:fade-in-0
      data-[state=closed]:zoom-out-95
      data-[state=open]:zoom-in-95
      data-[side=bottom]:slide-in-from-top-2
      data-[side=left]:slide-in-from-right-2
      data-[side=right]:slide-in-from-left-2
      data-[side=top]:slide-in-from-bottom-2
      "
    >
      <ComboboxViewport>
        <ComboboxEmpty
          p="y-3"
          text="center sm"
        />
        <template
          v-for="(option, index) of options"
          :key="option.label"
        >
          <ComboboxGroup
            overflow="hidden"
            p="1"
          >
            <ComboboxLabel
              overflow="hidden"
              text="foreground/50"
              flex="~"
              justify="start"
              items="center"
              w="full"
              p="x-2 y-1"
            >
              {{ option.label }}
            </ComboboxLabel>
            <ComboboxItem
              v-for="item in option.items"
              :key="item"
              :value="item"
              overflow="hidden"
              text="foreground"
              flex="~"
              justify="start"
              items="center"
              w="full"
              p="x-2 y-1"
              bg="data-[highlighted]:accent"
              rounded="data-[highlighted]:~"
            >
              <span>{{ item }}</span>
              <ComboboxItemIndicator
                m="l-auto"
                h="4"
                w="4"
              >
                <Icon name="carbon:checkmark" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator
            v-show="index !== options.length - 1"
            h="0.25"
            bg="foreground/60"
            m="1"
          />
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
