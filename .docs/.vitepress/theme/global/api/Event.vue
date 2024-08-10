<script setup lang="ts">
import { Icon } from 'destyler'

const props = defineProps<{
  value: {
    name: string
    type: string
    description: string
  }[]
}>()
</script>

<template>
  <table
    class="
    border-solid border-#ededed dark:border-#282828
    bg-#f8f8f8 dark:bg-#1c1c1c
     rounded-md w-full mt-8"
  >
    <thead class="bg-#F4F4F5 dark:bg-#27272A rounded-t-md">
      <tr>
        <th class="text-start px-3 py-1 rounded-lt-md">
          Event
        </th>
        <th class="text-start px-3 py-1 rounded-rt-md">
          Type
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
                  <Icon name="carbon:information-square" class="w-4 h-4" />
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
      </tr>
    </tbody>
  </table>
</template>
