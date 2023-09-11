<script setup lang="ts">
import { DestylerDisclosure } from 'destyler'

const selected = ref('item1')
const selected1 = ref('item1')

const checkbox = ref<boolean>(true)

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

const alertList = ref<number>(0)

const visible = ref(false)
</script>

<template>
  <div>
    {{ selected }}
  </div>
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
  <br>
  <DestylerAccordionRoot v-model="selected1">
    <DestylerAccordionItem v-for="item in items" :key="item.value" :value="item.value">
      <template #header>
        {{ item.title }}
      </template>
      <template #conter>
        {{ item.content }}
      </template>
    </DestylerAccordionItem>
  </DestylerAccordionRoot>
  <br>
  <DestylerIcon name="carbon-home" />

  <DestylerButton :disabled="true">
    button
  </DestylerButton>

  <DestylerAvatar />

  {{ checkbox }}
  <DestylerCheckbox
    v-model="checkbox"
  >
    <DestylerIcon name="carbon-checkmark" />
  </DestylerCheckbox>

  <br>
  <br>
  <DestylerButton @click="alertList++">
    add alert
  </DestylerButton>
  <DestylerAlert v-for="i in alertList" :key="i">
    {{ i }}
  </DestylerAlert>
  <br>
  <br>
  <DestylerDisclosure>
    <template #action="{ action, handleToggleAction }">
      <DestylerButton @click="handleToggleAction">
        {{ action }}
      </DestylerButton>
    </template>
    111111
  </DestylerDisclosure>
  <br>
  <br>
  {{ visible }}
  <button @click="visible = !visible">
    show dialog
  </button>
  <DestylerDialog v-slot="{ handleVisible }" v-model="visible">
    <button @click="handleVisible">
      close
    </button>
    <div>hello</div>
  </DestylerDialog>
</template>
