// @noErrors
<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@destyler/label'
import { Icon } from '@destyler/icon'
import { DynamicInput, DynamicItem, DynamicItemDelete, DynamicItemText, DynamicRoot } from '@destyler/dynamic'

const modelValue = ref(['Vue', 'Destyler UI'])
</script>

<template>
  <div
    space="y-2"
    flex="~ col"
    items="start"
  >
    <Label
      text="sm primary left"
      font="medium"
      leadin="none"
      cursor="peer-disabled:not-allowed"
      op="peer-disabled:70"
    >
      Topics
    </Label>
    <DynamicRoot
      v-model="modelValue"
      w="full"
      flex="~ col"
      gap="3"
    >
      <div
        rounded="md"
        max-w="450px"
        flex="~ wrap"
        gap="2"
      >
        <DynamicItem
          v-for="item in modelValue"
          :key="item"
          :value="item"
          text="primary-foreground"
          flex="~"
          shadow="md"
          items="center"
          justify="center"
          gap="2"
          bg="primary"
          rounded="~"
          p="1"
        >
          <DynamicItemText text="sm" p="l-1" />
          <DynamicItemDelete
            p="0.5"
            rounded="~"
            bg="transparent hover:accent hover:op-10"
          >
            <Icon name="radix-icons:cross-2" />
          </DynamicItemDelete>
        </DynamicItem>
      </div>
      <div w="450px" text="primary">
        <DynamicInput
          placeholder="Fruits..."
          flex="~"
          h="10"
          w="full"
          rounded="md"
          border="~ input"
          bg="background"
          p="x-3 y-2"
          text="sm placeholder:muted-foreground"
          ring-offset="background"
          file="border-0 bg-transparent text-sm font-medium"
          focus-visible="outline-none ring-2 ring-ring ring-offset-2"
          cursor="disabled:not-allowed"
          op="disabled:50"
        />
      </div>
    </DynamicRoot>
  </div>
</template>
