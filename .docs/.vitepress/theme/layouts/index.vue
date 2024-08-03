<script setup lang="ts">
import { useData } from 'vitepress'
import HomePage from '~/theme/pages/home.vue'
import DocsPage from '~/theme/pages/docs.vue'

const { frontmatter } = useData()

const components = computed(() => {
  if (frontmatter.value.layout === 'home') {
    return HomePage
  }
  else if (frontmatter.value.layout === 'docs') {
    return DocsPage
  }
  return 'div'
})
</script>

<template>
  <Header />
  <ArtDot v-if="frontmatter.art" />
  <component :is="components" />
  <Footer />
</template>
