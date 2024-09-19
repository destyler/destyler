<script setup lang="ts">
import { ref, watch } from 'vue'
import { useData } from 'vitepress'
import { Icon, Link } from 'destyler'
import size from '../../../../public/export-size.json'

const { frontmatter } = useData()

const packages = ref()

const githubSource = ref('')

watch(frontmatter, () => {
  let value = size.destyler
  let componentName = 'destyler'
  if (frontmatter.value.component) {
    componentName = `components/${frontmatter.value.component}`
    githubSource.value = componentName
    value = size[`${componentName}` as keyof typeof size]
  }

  packages.value = [
    {
      icon: 'carbon:box',
      title: `Version ${value.version}`,
      type: 'dynamic',
      href: `https://www.npmjs.com/package/${value.name}`,
    },
    {
      icon: 'carbon:export',
      title: `Size ${value.size}`,
      type: 'dynamic',
      href: `https://bundlephobia.com/package/${value.name}`,
    },
    {
      icon: 'carbon:logo-github',
      title: 'View source',
      type: 'static',
      href: `https://github.com/destyler/destyler/tree/main/packages/${componentName}`,
    },
  ]
}, {
  deep: true,
  immediate: true,
})
</script>

<template>
  <div class="flex items-center gap-1.5 lg:cursor-text lg:select-text w-full group" tabindex="-1">
    <span class="font-semibold text-sm/6 truncate">Packages</span>
  </div>
  <ul class="space-y-3 lg:space-y-1.5">
    <li v-for="(item, index) in packages" :key="index" class="mt-0 pt-2">
      <Link
        class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        :to="item.href"
        target="_blank"
      >
        <Icon class="w-5 h-5 flex-shrink-0" :name="item.icon" />
        <span class="text-sm/6 font-medium relative">{{ item.title }}</span>
      </Link>
    </li>
  </ul>
</template>
