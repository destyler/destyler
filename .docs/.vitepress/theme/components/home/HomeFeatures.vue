<script setup lang="ts">
import { Icon } from 'destyler'
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <section class="py-24 max-w-screen-xl mx-auto md:px-6">
    <div class="text-center flex flex-col items-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
        <span>Everything you expect from a
          <br class="hidden lg:block">
          <span class="text-primary">
            UI component library
          </span>
        </span>
      </h2>
    </div>
    <div class="mt-16 sm:mt-24">
      <div class="grid grid-cols-1 lg:grid-cols-5 h-[36rem] lg:h-96 gap-y-4 lg:gap-4">
        <!-- features -->
        <div class="flex flex-col col-span-3 rounded-2xl border border-muted p-10 overflow-hidden relative">
          <GridPattern />
          <div class="font-bold text-lg">
            Accessibility out of the box.
          </div>
          <div class="text-muted-foreground">
            Supports assistive technology
          </div>

          <div class="w-full h-full flex items-center justify-center relative ">
            <div
              class="
            absolute font-medium text-sm text-muted-foreground
            -translate-x-40 -translate-y-0 rounded-full border
            border-muted px-5 py-2.5 bg-background/50
            backdrop-blur-lg flex items-center gap-2 cursor-pointer
            transition-transform duration-200 hover:-rotate-6 hover:scale-105
            "
            >
              <Icon
                name="carbon:ai-governance-lifecycle"
                class="text-primary text-xl"
              />
              <span>WAI-ARIA compliant</span>
            </div>

            <div
              class="
            absolute font-medium text-sm text-muted-foreground
            translate-x-28 -translate-y-16 rounded-full border
            border-muted px-5 py-2.5 bg-background/50
            backdrop-blur-lg flex items-center gap-2 cursor-pointer
            transition-transform duration-200 hover:-rotate-6 hover:scale-105
            "
            >
              <Icon
                name="carbon:keyboard"
                class="text-primary text-xl"
              />
              <span>Keyboard navigation</span>
            </div>

            <div
              class="
            absolute font-medium text-sm text-muted-foreground
            -translate-x-20 translate-y-16 rounded-full border
            border-muted px-5 py-2.5 bg-background/50
            flex items-center gap-2 cursor-pointer
            transition-transform duration-200 hover:-rotate-6 hover:scale-105
            "
            >
              <Icon
                name="carbon:scalpel-cursor"
                class="text-primary text-xl"
              />
              <span>Focus management</span>
            </div>

            <div
              class="
            absolute font-medium text-sm text-muted-foreground
            translate-x-44 translate-y-4 rounded-full border
            border-muted px-5 py-2.5 bg-background/50
            backdrop-blur-lg flex items-center gap-2 cursor-pointer
            transition-transform duration-200 hover:-rotate-6 hover:scale-105"
            >
              <Icon
                name="carbon:view"
                class="text-primary text-xl"
              />
              <span>Screen reader support</span>
            </div>
          </div>
        </div>
        <!-- code snippets -->
        <div class="col-span-2 rounded-2xl border border-muted p-10 relative overflow-hidden">
          <div class="absolute flex flex-col">
            <div class="font-bold text-lg z-10 ">
              Developer Experience First.
            </div>
            <div class="text-muted-foreground">
              Unstyled, Customizable, Familiar API
            </div>

            <div class="w-full h-full relative mt-8">
              <div class="language-vue">
                <HomeCodeUnstyle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 lg:grid-cols-5 h-[36rem] lg:h-96 gap-y-4 lg:gap-4">
        <!-- components -->
        <div class="col-span-2 rounded-2xl border border-muted p-10 relative overflow-hidden">
          <div>
            <div class="font-bold text-lg">
              Save time. Ship faster.
            </div>
            <div class="text-muted-foreground">
              40+ Components
            </div>
          </div>

          <div class="w-full h-full flex justify-center items-center">
            <ParticlesEffect
              v-if="isDark"
              :density="1200"
              color="#FFFFFF"
              class="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            />
            <ParticlesEffect
              v-else
              :density="1200"
              color="#000000"
              class="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            />
          </div>
        </div>
        <!-- granular -->
        <div class="flex flex-col col-span-3 rounded-2xl border border-muted p-10 overflow-hidden relative">
          <div class="font-bold text-lg">
            Granular access to each component part.
          </div>
          <div class="text-muted-foreground">
            Wrap them and add your own event listeners, props, etc.
          </div>

          <div class="w-full h-full relative mt-8">
            <div class="language-vue">
              <HomeCodeGranular />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="grid grid-cols-1 lg:grid-cols-5 h-[36rem] lg:h-96 gap-y-4 lg:gap-4 mt-4" /> -->
  </section>
</template>
