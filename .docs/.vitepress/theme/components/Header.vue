<script setup lang="ts">
import { useData } from 'vitepress'
import { Button, Icon, Link } from 'destyler'
import { useAppearance } from '../composables/appearance'

const { site } = useData()

const { nav = [] } = site.value?.themeConfig

const { toggleDark, isDark } = useAppearance()
</script>

<template>
  <header class="sticky top-0 z-40 w-full -mb-px border-solid border-b border-border bg-background text-[--accent] overscroll-none">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[var(--header-height)]">
      <!-- logo -->
      <div class="lg:flex-1 flex items-center gap-1.5">
        <a href="/" class="flex justify-center items-center">
          <Logo />
          <span class="text-xl pl-2 font-bold">
            Destyler <span class="text-primary">UI</span>
          </span>
        </a>
      </div>
      <!-- nav -->
      <ul class="items-center gap-x-8 hidden lg:flex">
        <li v-for="item in nav" :key="item.link" class="relative">
          <a
            :href="item.link"
            class="text-sm/6 font-semibold flex items-center gap-1 hover:text-primary cursor-pointer"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
      <!-- tools -->
      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <!-- color -->
        <div class="relative">
          <ColorPick>
            <Button
              class="head-btn"
            >
              <Icon name="carbon:color-palette" class="w-5 h-5" />
            </Button>
          </ColorPick>
        </div>
        <!-- search -->
        <div class="relative inline-flex">
          <Search />
        </div>
        <!-- toggle Theme -->
        <Button
          class="head-btn"
          @click="toggleDark"
        >
          <Icon v-if="isDark" name="carbon:moon" class="w-5 h-5" />
          <Icon v-else name="carbon:sun" class="w-5 h-5" />
        </Button>
        <!-- GitHub -->
        <Link
          to="https://github.com/destyler/destyler"
          class="head-btn"
        >
          <Icon name="carbon:logo-github" class="w-5 h-5" />
        </Link>
      </div>
    </div>
  </header>
</template>
