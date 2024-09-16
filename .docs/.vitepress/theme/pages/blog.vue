<script setup lang="ts">
import { data } from '~/theme/utils/blog.data'
</script>

<template>
  <main class="min-h-[calc(100vh-var(--header-height))]">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- title -->
      <div class="py-8 sm:py-16">
        <div class="gap-8 sm:gap-y-16 grid lg:grid-cols-2 lg:items-center">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              The Destyler Blog
            </h1>
            <div class="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Read the latest news about all Destyler, from components announcements to theme tutorials.
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
        <div class="lg:col-span-10">
          <div class="mt-8 pb-24">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <!-- item -->
              <Item
                v-for="item in data"
                :key="item.date"
                :url="item.url"
                :title="item.title"
                :og="item.og"
                :type="item.type"
                :date="item.date"
                :duration="item.duration"
                :authors="item.authors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
