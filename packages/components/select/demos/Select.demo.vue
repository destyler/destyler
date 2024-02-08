<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerSelectContent,
  DestylerSelectGroup,
  DestylerSelectItem,
  DestylerSelectItemIndicator,
  DestylerSelectItemText,
  DestylerSelectLabel,
  DestylerSelectPortal,
  DestylerSelectRoot,
  DestylerSelectScrollDownButton,
  DestylerSelectScrollUpButton,
  DestylerSelectSeparator,
  DestylerSelectTrigger,
  DestylerSelectValue,
  DestylerSelectViewport,
} from '../src'

const fruit = ref('')

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const POSITION = ['popper'] as const
</script>

<template>
  <DestylerSelectRoot
    v-for="position in POSITION"
    :key="position"
    v-model="fruit"
    aria-label="Fruits"
  >
    <DestylerSelectTrigger
      aria-label="Customise options"
    >
      <DestylerSelectValue placeholder="Please select a fruit">
        {{ fruit }}
      </DestylerSelectValue>
    </DestylerSelectTrigger>

    <DestylerSelectPortal>
      <DestylerSelectContent
        :side-offset="5"
        :position="position"
      >
        <DestylerSelectScrollUpButton>
          up
        </DestylerSelectScrollUpButton>

        <DestylerSelectViewport>
          <DestylerSelectLabel>
            Fruits
          </DestylerSelectLabel>
          <DestylerSelectGroup>
            <DestylerSelectItem
              v-for="(option, index) in options"
              :key="index"
              :value="option"
            >
              <DestylerSelectItemIndicator>
                check
              </DestylerSelectItemIndicator>
              <DestylerSelectItemText>
                {{ option }}
              </DestylerSelectItemText>
            </DestylerSelectItem>
          </DestylerSelectGroup>
          <DestylerSelectSeparator />
          <DestylerSelectLabel>
            Vegetables
          </DestylerSelectLabel>
          <DestylerSelectGroup>
            <DestylerSelectItem
              v-for="(option, index) in vegetables"
              :key="index"
              :value="option"
              :disabled="option === 'Courgette'"
            >
              <DestylerSelectItemIndicator>
                check
              </DestylerSelectItemIndicator>
              <DestylerSelectItemText>
                {{ option }}
              </DestylerSelectItemText>
            </DestylerSelectItem>
          </DestylerSelectGroup>
        </DestylerSelectViewport>

        <DestylerSelectScrollDownButton>
          check
        </DestylerSelectScrollDownButton>
      </DestylerSelectContent>
    </DestylerSelectPortal>
  </DestylerSelectRoot>
</template>
