<script setup lang="ts">
import { DestylerLabel } from '@destyler/label/src/label'
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-solid border-b border-black border-op-9 dark:border-white dark:border-op-9 dark:bg-#09090a dark:text-#e8e8e9">
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="mr-4 hidden md:flex">
        <NuxtLink to="/" class="cursor-pointer flex items-center mr-6">
          <Logo class="mr-3 " />
          <DestylerLabel class="cursor-pointer">
            <span>Destyler</span>
            <sup>{{ lastVersion }}</sup>
          </DestylerLabel>
        </NuxtLink>
        <nav class="flex items-center gap-6 text-sm">
          <NavItem v-for="item in headNavItems" :key="item.link" :link="item.link" :title="item.text" />
        </nav>
      </div>
      <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <div class="w-full flex-1 md:w-auto md:flex-none">
          <button class="px-4 py-2 relative h-8 w-full  sm:pr-12 md:w-40 lg:w-64" />
        </div>
        <nav class="flex items-center">
          <NavIconItem v-for="item in headNavIconItem" :key="item.link" :link="item.link" :icon="item.icon" />
          <ToggleColor />
        </nav>
      </div>
    </div>
  </header>
</template>
