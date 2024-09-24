<script setup lang="ts">
import { Icon, Link } from 'destyler'

const footers = [
  {
    site: true,
    text: 'Figma Kit',
    link: '',
  },
  {
    site: true,
    text: 'Playground',
    link: 'https://play.destyler.org',
  },
  {
    site: true,
    text: 'Roadmap',
    link: 'https://github.com/destyler/destyler/pulls?q=sort:updated-desc+is:pr+is:open',
  },
  {
    site: true,
    text: 'Releases',
    link: 'https://github.com/destyler/destyler/releases',
  },
]

const icons = [
  {
    icon: 'carbon:logo-discord',
    link: 'https://discord.gg/SwgESrV7HY',
  },
  {
    icon: 'carbon:logo-x',
    link: 'https://x.com/elonehoo',
  },
  {
    icon: 'carbon:logo-github',
    link: 'https://gitub.com/destyler',
  },
]
</script>

<template>
  <div class="w-full h-px bg-border flex items-center justify-center mb-3 mt-12">
    <div class="bg-white dark:bg-black px-4">
      <Logo class="w-6 h-6" />
    </div>
  </div>
  <footer class="relative">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3">
      <div class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3">
        <!-- logo -->
        <Link
          v-for="icon in icons"
          :key="icon.link"
          class="head-btn"
          :to="icon.link"
        >
          <Icon class="flex-shrink-0 h-5 w-5" :name="icon.icon" />
        </Link>
      </div>
      <div class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center">
        <!-- main -->
        <ul class="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6">
          <li v-for="footer in footers" :key="footer.link" class="relative">
            <Link
              :to="footer.link"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {{ footer.text }}
              <Icon v-if="footer.site" name="carbon:arrow-up-right" class="w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500" />
            </Link>
          </li>
        </ul>
      </div>
      <div class="flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1">
        <!-- license -->
        <Link to="https://github.com/destyler" rel="noopener noreferrer" target="_blank" class="text-sm text-gray-500 dark:text-gray-400">
          Published under <span class="text-gray-900 dark:text-white">MIT License</span>
        </Link>
      </div>
    </div>
  </footer>
</template>
