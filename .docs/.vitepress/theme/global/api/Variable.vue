<script setup lang="ts">
const props = defineProps<{
  value: {
    name: string
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
    <thead class="bg-#F4F4F5 dark:bg-#27272A">
      <tr>
        <th class="text-start px-3 py-1 rounded-lt-md">
          CSS Variable
        </th>
        <th class="text-start px-3 py-1">
          Description
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="prop in props.value" :key="prop.name">
        <td class="flex items-center">
          <div class="px-3 py-1 flex justify-center items-center">
            <span class="mr-2 font-bold">{{ prop.name }}</span>
          </div>
        </td>
        <td>
          <div class="px-3 py-1">
            <code class="text-black! dark:text-white!">{{ prop.description }}</code>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
