<script setup lang="ts">
import { Label, Link } from 'destyler'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import { getSidebar } from '../utils/sidebar'

const { site } = useData()

const route = useRoute()

const asideItems = computed(() => {
  return getSidebar(site.value.themeConfig.sidebar, route.path)
})
</script>

<template>
  <aside
    class="
    hidden lg:-mx-4 lg:block scrollbar-hide
    overflow-y-scroll z-11 lg:max-h-[calc(100vh-var(--header-height))]
    lg:sticky lg:top-[--header-height] py-8 lg:px-4
    "
  >
    <div class="relative">
      <nav class="space-y-3">
        <div class="w-full flex flex-col space-y-3">
          <div v-for="(aside, index) in asideItems" :key="index">
            <Label
              class="flex items-center gap-1.5 group w-full focus-visible:outline-primary border-transparent text-sm/6 font-semibold truncate"
            >
              {{ aside.text }}
            </Label>
            <div class="mt-3" style="height: auto;">
              <div class="text-sm text-inherit dark:text-inherit">
                <nav class="space-y-3 border-l border-gray-200 dark:border-dark-800 ml-2.5">
                  <div class="space-y-1.5">
                    <Link
                      v-for="item in aside.items"
                      :key="item.link"
                      :to="item.link"
                      class="flex items-center gap-1.5 group border-l -ml-px pl-4 cursor-pointer"
                      :class="{
                        'text-primary border-primary': route.path === item.link,
                        'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400': route.path !== item.link,
                      }"
                    >
                      <span class="text-sm/6 truncate">{{ item.text }}</span>
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>
