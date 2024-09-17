<script setup lang="ts">
import { ref } from 'vue'
import { Button, Icon, InfoRoot } from 'destyler'
import { useClipboard } from '@vueuse/core'
import { useData, useRouter } from 'vitepress'

defineOptions({
  name: 'HomePage',
})

const router = useRouter()
const { page } = useData()

const installScript = ref('pnpm add destyler')
const { copy } = useClipboard({ source: installScript })

const isCopied = ref(false)
function handleCopy() {
  copy(installScript.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

function handleGo(path: string) {
  router.go(path)
}
</script>

<template>
  <main class="min-h-[calc(100vh-var(--header-height))] px-7 py-10 of-x-hidden">
    <!-- hero -->
    <div class="py-24 sm:py-32 md:py-40 relative mb-[8rem]">
      <LandingBackground />
      <div class="mx-auto px-4 sm:px-6 lg:px-8 gap-16 sm:gap-y-24 flex flex-col max-w-4xl">
        <div class="text-center relative z-[2]">
          <!-- version alert -->
          <div class="mb-10">
            <InfoRoot
              class="inline-flex items-center text-sm px-4 py-1 bg-primary/20 dark:bg-opacity-10 text-primary ring-1 ring-inset ring-primary/500 ring-opacity-25 dark:ring-opacity-25 hover:bg-primary/35 transition-color relative font-medium rounded-full shadow-none cursor-pointer"
              @click="handleGo(page.frontmatter.news[0].link)"
            >
              {{ page.frontmatter.news[0].title }}
            </InfoRoot>
          </div>
          <!-- title -->
          <div class="text-5xl font-bold tracking-tight text-dark-900 dark:text-white sm:text-7xl">
            A <span class="text-primary">Build UI</span> for
            <br class="hidden lg:block">
            Your design system
          </div>
          <!-- desc -->
          <div class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
            <span>
              Destyler UI simplifies the creation of stunning and responsive web applications with its
              <br class="hidden lg:block">
              comprehensive collection of fully styled and customizable UI components designed for You.
            </span>
          </div>
          <!-- action -->
          <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
            <Button class="btn" @click="handleGo('/guide/introduction')">
              Get Started
              <Icon name="carbon:direction-straight-right" class="flex-shrink-0 h-5 w-5" />
            </Button>
            <div class="relative w-72">
              <input
                type="text"
                class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-dark-500 text-sm px-3.5 py-2.5 shadow-sm bg-gray-50 dark:bg-dark-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-dark-300 ps-11 pe-11 focus:ring-1 focus:ring-gray-300 dark:focus:ring-dark-700"
                readonly
                autocomplete="off"
                aria-label="Install destyler"
                :value="installScript"
              >
              <span class="absolute inset-y-0 start-0 flex items-center pointer-events-none px-3.5">
                <Icon name="carbon:terminal" class="flex-shrink-0 text-dark-400 dark:text-light-500 h-5 w-5" />
              </span>
              <span class="absolute inset-y-0 end-0 flex items-center px-3.5">
                <Button
                  class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-xs gap-x-1 p-1 text-dark-500 dark:text-light-400 hover:text-dark-700 dark:hover:text-light-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 inline-flex items-center bg-transparent"
                  @click="handleCopy"
                >
                  <Icon v-if="isCopied" name="carbon:checkmark" class="flex-shrink-0 h-4 w-4 text-primary" />
                  <Icon v-else name="carbon:copy" class="flex-shrink-0 h-4 w-4" />
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <HomeDemo />
    <HomeFeatures />
  </main>
</template>
