<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerNavigationContent,
  DestylerNavigationItem,
  DestylerNavigationLink,
  DestylerNavigationList,
  DestylerNavigationRoot,
  DestylerNavigationTrigger,
  DestylerNavigationViewport,
} from '../src'

const gattings = ref([
  {
    link: '/guide/introduction',
    title: 'Introduction',
    description: 'Re-usable components built using Destyler.',
  },
  {
    link: '/guide/install',
    title: 'Installation',
    description: 'How to install dependencies and structure your app.',
  },
])

const components = ref([
  {
    title: 'Modal',
    href: '/components/modal',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/components/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/components/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/components/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/components/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/components/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
])

const currentTrigger = ref('destyler-2')
</script>

<template>
  <DestylerNavigationRoot
    v-model="currentTrigger"
    class="relative z-10 flex max-w-max flex-1 items-center justify-center"
  >
    <DestylerNavigationList class="group flex flex-1 list-none items-center justify-center space-x-1">
      <DestylerNavigationItem>
        <DestylerNavigationTrigger class="group inline-flex h-9 w-max items-center justify-center rounded-md bg-#FFFFFF dark:bg-#1C1C1C px-4 py-2 text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A dark:hover:text-#FAFAFA hover:text-#18181B dark:focus:bg-#1C1C1C focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:data-[active]:bg-#18181B/50 data-[active]:bg-#27272A/50 data-[state=open]:bg-#F4F4F5/50 dark:data-[state=open]:bg-#27272A/50">
          Getting started
        </DestylerNavigationTrigger>
        <DestylerNavigationContent class="left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ">
          <ul class="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li class="row-span-3">
              <DestylerNavigationLink as-child>
                <a
                  class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <div class="mb-2 mt-4 text-lg font-medium">
                    destyler
                  </div>
                  <p class="text-sm leading-tight text-muted-foreground">
                    unstyled component for vue.
                  </p>
                </a>
              </DestylerNavigationLink>
            </li>
            <li v-for="data in gattings" :key="data.link">
              <DestylerNavigationLink as-child>
                <a
                  :href="data.link"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-#F4F4F5 dark:hover:bg-#09090B dark:hover:text-#FAFAFA hover:text-#18181B dark:focus:bg-#1C1C1C focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B"
                >
                  <div class="text-sm font-medium leading-none">{{ data.title }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ data.description }}
                  </p>
                </a>
              </DestylerNavigationLink>
            </li>
          </ul>
        </DestylerNavigationContent>
      </DestylerNavigationItem>
      <DestylerNavigationItem>
        <DestylerNavigationTrigger class="group inline-flex h-9 w-max items-center justify-center rounded-md bg-#FFFFFF dark:bg-#1C1C1C px-4 py-2 text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A dark:hover:text-#FAFAFA hover:text-#18181B dark:focus:bg-#1C1C1C focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:data-[active]:bg-#18181B/50 data-[active]:bg-#27272A/50 data-[state=open]:bg-#F4F4F5/50 dark:data-[state=open]:bg-#27272A/50">
          Components
        </DestylerNavigationTrigger>
        <DestylerNavigationContent class="left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ">
          <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
            <li v-for="data in components" :key="data.href">
              <DestylerNavigationLink as-child>
                <a
                  :href="data.href"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A dark:hover:text-#FAFAFA hover:text-#18181B dark:focus:bg-#1C1C1C focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B"
                >
                  <div class="text-sm font-medium leading-none">{{ data.title }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ data.description }}
                  </p>
                </a>
              </DestylerNavigationLink>
            </li>
          </ul>
        </DestylerNavigationContent>
      </DestylerNavigationItem>
      <DestylerNavigationItem>
        Documentation
      </DestylerNavigationItem>
    </DestylerNavigationList>
    <div class="absolute left-0 top-full flex justify-center">
      <DestylerNavigationViewport class="origin-top-center! mt-1.5 h-[var(--destyler\_navigation\_menu\_viewport\_height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--destyler\_navigation\_menu\_viewport\_width)]" />
    </div>
  </DestylerNavigationRoot>
</template>
