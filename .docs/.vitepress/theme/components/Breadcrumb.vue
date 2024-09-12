<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import { Icon } from '@destyler/icon'
import { BreadcrumbsContent, BreadcrumbsItem, BreadcrumbsLabel, BreadcrumbsRoot, BreadcrumbsSeparator } from '@destyler/breadcrumbs'
import { getSidebar } from '../utils/sidebar'

const { site } = useData()

const route = useRoute()

const breadcrumb = computed(() => {
  for (const sidebar of getSidebar(site.value.themeConfig.sidebar, route.path)) {
    for (const items of sidebar.items!) {
      if (items.link === route.path) {
        return [
          {
            text: sidebar.text,
            link: sidebar.link,
          },
          {
            text: items.text,
            link: items.link,
          },
        ]
      }
    }
  }
  return []
})
</script>

<template>
  <div class="mb-3 text-sm/6 font-semibold text-primary flex items-center gap-1.5">
    <BreadcrumbsRoot>
      <BreadcrumbsContent class="gap-1.5 flex items-center sm:gap-2.5 text-sm">
        <BreadcrumbsItem
          v-for="(item, index) in breadcrumb"
          :key="item.link"
          class="
          before:content-none! p-none!
          flex items-center text-sm gap-1.5
          "
        >
          <BreadcrumbsLabel
            class="
            border-none!
            overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer
            text-muted-foreground! hover:text-foreground!
            data-[state=active]:text-foreground!
            "
          >
            {{ item.text }}
          </BreadcrumbsLabel>
          <BreadcrumbsSeparator v-if="index !== breadcrumb.length - 1" class="w-2 text-muted-foreground!">
            <Icon name="carbon:chevron-right" />
          </BreadcrumbsSeparator>
        </BreadcrumbsItem>
      </BreadcrumbsContent>
    </BreadcrumbsRoot>
  </div>
</template>
