<script setup lang="ts">
import { useData } from 'vitepress'
import HomePage from '~/theme/pages/home.vue'
import DocsPage from '~/theme/pages/docs.vue'
import BlogHomePage from '~/theme/pages/blog.vue'
import BlogItemPage from '~/theme/pages/item.vue'
import ErrorPage from '~/theme/pages/error.vue'

const { frontmatter } = useData()

const components = computed(() => {
  if (frontmatter.value.layout === 'home') {
    return HomePage
  }
  else if (frontmatter.value.layout === 'docs') {
    return DocsPage
  }
  else if (frontmatter.value.layout === 'blog-home') {
    return BlogHomePage
  }
  else if (frontmatter.value.layout === 'blog-item') {
    return BlogItemPage
  }
  return ErrorPage
})
</script>

<template>
  <Header />
  <component :is="components" />
  <Footer />
</template>
