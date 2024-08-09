<script setup lang="ts">
import { useRouter } from 'vitepress'
import { Button, Icon } from 'destyler'

const props = defineProps<{
  text: string
  link: string
}>()

const router = useRouter()

function goPrev() {
  router.go(props.link)
}
</script>

<template>
  <Button
    class="
    block px-6 py-4 not-prose
    border! rounded-md! [border:1]! border-solid
    border-black! border-op-10!
    dark:border-white! dark:border-op-10!
    hover:bg-#F4F4F5/50 dark:hover:bg-#27272A/50
    group text-left"
    @click="goPrev"
  >
    <div
      class="
      inline-flex items-center rounded-full p-1.5
      bg-white dark:bg-black
      group-hover:bg-primary/10
      ring-1 ring-gray-300
      dark:ring-gray-700 mb-4
      group-hover:ring-primary/50"
    >
      <Icon name="carbon:arrow-left" class="w-5 h-5 text-gray-900 dark:text-white group-hover:text-primary" />
    </div>
    <p class="font-medium text-gray-900 dark:text-white text-[15px] mb-1">
      {{ props.text }}
    </p>
  </Button>
</template>
