<script setup lang="ts">
import { Icon } from 'destyler'

const props = defineProps<{
  value: {
    name: string
    type: string
    default: string
    description: string
  }[]
}>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Default</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="prop in props.value" :key="prop.name">
        <td class="flex items-center">
          <span class="mr-2 font-bold">{{ prop.name }}</span>
          <Popover>
            <template #trigger>
              <Icon name="carbon:information-square" />
            </template>
            <span v-html="prop.description" />
          </Popover>
        </td>
        <td>
          <code>{{ prop.type }}</code>
        </td>
        <td>
          <code>{{ prop.default }}</code>
        </td>
      </tr>
    </tbody>
  </table>
</template>
