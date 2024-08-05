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
  <table
    class="
    border-solid border-#ededed dark:border-#282828
    bg-#f8f8f8 dark:bg-#1c1c1c
     rounded-md w-full"
  >
    <thead class="bg-#F4F4F5 dark:bg-#27272A">
      <tr>
        <th class="text-start px-3 py-1 rounded-lt-md">
          Name
        </th>
        <th class="text-start px-3 py-1">
          Type
        </th>
        <th class="text-start px-3 py-1 rounded-rt-md">
          Default
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="prop in props.value" :key="prop.name">
        <td class="flex items-center">
          <div class="px-3 py-1 flex justify-center items-center">
            <span class="mr-2 font-bold">{{ prop.name }}</span>
            <Popover>
              <template #trigger>
                <div class="w-5 h-5 flex justify-center items-center hover:bg-white dark:hover:bg-black rounded-sm">
                  <Icon name="carbon:information-square" />
                </div>
              </template>
              <span v-html="prop.description" />
            </Popover>
          </div>
        </td>
        <td>
          <div class="px-3 py-1">
            <code>{{ prop.type }}</code>
          </div>
        </td>
        <td>
          <div class="px-3 py-1">
            <code>{{ prop.default }}</code>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
