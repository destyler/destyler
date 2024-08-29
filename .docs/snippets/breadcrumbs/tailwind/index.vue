<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { BreadcrumbsContent, BreadcrumbsItem, BreadcrumbsLabel, BreadcrumbsRoot, BreadcrumbsSeparator } from '@destyler/breadcrumbs'

const lists = ref([
  {
    label: 'Home',
    link: '/',
  },
  {
    label: 'Components',
    link: '/guide/components',
  },
  {
    label: 'Breadcrumbs',
    link: '/components/breadcrumbs',
  },
])
</script>

<template>
  <BreadcrumbsRoot>
    <BreadcrumbsContent class="gap-1.5 flex items-center sm:gap-2.5 text-sm">
      <BreadcrumbsItem
        v-for="(item) in lists"
        :key="item.link"
        class="
        flex items-center text-sm gap-1.5

        "
      >
        <BreadcrumbsLabel
          class="
          border-none!
          overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer
          text-muted-foreground hover:text-foreground
          data-[state=active]:text-foreground
          "
          :href="item.link"
        >
          {{ item.label }}
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator class="w-2 text-muted-foreground">
          <Icon name="carbon:chevron-right" />
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
