<script setup lang="ts">
import { DestylerIcon } from 'destyler'
import size from '~/public/export-size.json'

const router = useRouter()

const packages = ref()

const githubSource = ref('')

onMounted(() => {
  let value = size.destyler
  let componentName = 'destyler'
  if (router.currentRoute.value.fullPath.includes('/components/')) {
    componentName = `components/${router.currentRoute.value.fullPath.split('/').pop()!.replace(/-([a-z])/g, g => g[1].toUpperCase())}`
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
      title: `Export Size ${value.size}`,
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
})
</script>

<template>
  <ul class="m-0 list-none">
    <li v-for="(item, index) in packages" :key="index" class="mt-0 pt-2">
      <NuxtLink
        class="flex items-center inline-block no-underline transition-colors text-#09090b dark:text-#fafafa text-op-60! hover:text-op-80! hover:text-op-100!"
        :to="item.href"
        target="_blank"
      >
        <DestylerIcon class="w-4 h-4 mr-2" :name="item.icon" />
        {{ item.title }}
      </NuxtLink>
    </li>
  </ul>
</template>
