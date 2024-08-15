<script setup lang="ts">
// @noErrors
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
    <BreadcrumbsContent
      gap="1.5 sm:2.5"
      flex="~"
      items="center"
      text="sm"
    >
      <BreadcrumbsItem
        v-for="item in lists"
        :key="item.link"
        flex="~"
        items="center"
        text="sm"
        gap="1.5"
      >
        <BreadcrumbsLabel
          overflow="hidden"
          text="ellipsis muted-foreground hover:foreground data-[state=active]:foreground"
          whitespace="nowrap"
          cursor="pointer"
          :href="item.link"
        >
          {{ item.label }}
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator
          w="2"
          text="muted-foreground"
        >
          <Icon name="carbon:chevron-right" />
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
