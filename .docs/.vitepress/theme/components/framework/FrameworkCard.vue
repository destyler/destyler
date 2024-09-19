<script setup lang="ts">
import { useData } from 'vitepress'
import { Icon, Link } from 'destyler'

const props = defineProps<{
  link?: string
  lightIcon?: string
  darkIcon: string
  title: string
}>()

const { isDark } = useData()
</script>

<template>
  <Link
    :to="props.link"
    class="flex w-full flex-col items-center rounded-xl border! border-black! border-op-9! dark:border-white dark:border-op-9 bg-#FFFFFF dark:bg-#09090B p-6 text-#09090B hover:bg-#F4F4F5/50 dark:text-#FAFAFA shadow transition-colors dark:hover:bg-#27272A/50 sm:p-10 cursor-pointer"
  >
    <Icon v-if="!isDark" :name="props.lightIcon ? props.lightIcon : props.darkIcon" class="w-10 h-10" />
    <Icon v-else :name="props.darkIcon" class="w-10 h-10" />
    <p class="font-medium pt-4">
      {{ props.title }}
    </p>
  </Link>
</template>
