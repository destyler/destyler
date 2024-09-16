<script setup lang="ts">
import dayjs from 'dayjs'
import { useRouter } from 'vitepress'
import { InfoRoot } from 'destyler'

const props = defineProps<{
  url: string
  title: string
  og: string
  type: string
  date: string
  duration: string
  authors: string[]
}>()

const router = useRouter()

function handleGoto() {
  router.go(props.url)
}
</script>

<template>
  <div
    class="rounded-xl cursor-pointer border border-primary border-op-20 hover:border-op-100 bg-card text-card-foreground shadow-sm"
    @click="handleGoto"
  >
    <div class="aspect-w-4 aspect-h-2">
      <img
        class="object-cover object-top w-full h-full rounded-t-xl scrollbar-hide bg-card"
        width="384"
        height="192"
        alt="Destyler Release 0.0.4"
        :src="props.og"
      >
    </div>
    <div class="flex-1 px-4 py-5 sm:p-6">
      <div class="mb-6 flex">
        <InfoRoot class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
          {{ props.type }}
        </InfoRoot>
      </div>
      <p class="text-gray-900 dark:text-white font-semibold truncate flex items-center gap-1.5 text-lg">
        {{ props.title }}
      </p>
      <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
        {{ props.duration }}
      </div>
    </div>
    <div class="px-4 py-4 sm:px-6 pt-0">
      <div class="flex items-center justify-between gap-3">
        <time class="text-gray-500 dark:text-gray-400">{{ dayjs(props.date).format('MMM D, YYYY') }}</time>
        <div class="inline-flex flex-row-reverse justify-end">
          <span
            v-for="author in props.authors"
            :key="author"
            class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-6 w-6 text-xs ring-2 ring-input -me-1.5 first:me-0 lg:hover:scale-110 lg:hover:ring-primary transition-transform"
          >
            <img class="rounded-full h-6 w-6 text-xs" alt="Daniel Roe" :src="author">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
