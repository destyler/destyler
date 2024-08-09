<script setup lang="ts">
import { isActive } from '../../utils/shared'
import { getFlatSideBarLinks, getSidebar } from '../../utils/sidebar'

const { page, theme } = useData()

const prevPager = ref({
  text: '',
  link: '',
})
const nextPager = ref({
  text: '',
  link: '',
})

function pager() {
  const sidebar = getSidebar(theme.value.sidebar, page.value.relativePath)
  const links = getFlatSideBarLinks(sidebar)

  // ignore inner-page links with hashes
  const candidates = uniqBy(links, link => link.link.replace(/[?#].*$/, ''))
  const index = candidates.findIndex((link) => {
    return isActive(page.value.relativePath, link.link)
  })

  prevPager.value = {
    text: candidates[index - 1]?.text,
    link: candidates[index - 1]?.link,
  }

  nextPager.value = {
    text: candidates[index + 1]?.text,
    link: candidates[index + 1]?.link,
  }
}

function uniqBy<T>(array: T[], keyFn: (item: T) => any): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const k = keyFn(item)
    return seen.has(k) ? false : seen.add(k)
  })
}

const route = useRoute()
onMounted(() => {
  watch(route, () => {
    pager()
  }, {
    immediate: true,
    deep: true,
  })
})
</script>

<template>
  <div class="grid gap-8 sm:grid-cols-2">
    <Prev v-if="prevPager.text !== undefined" :text="prevPager.text" :link="prevPager.link" />
    <span v-else class="hidden sm:block" />
    <Next v-if="nextPager.text !== undefined" :text="nextPager.text" :link="nextPager.link" />
    <span v-else class="hidden sm:block" />
  </div>
</template>
