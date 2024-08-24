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
    <BreadcrumbsContent class="breadcrumbsContent">
      <BreadcrumbsItem
        v-for="(item) in lists"
        :key="item.link"
        class="breadcrumbsItem"
      >
        <BreadcrumbsLabel
          class="breadcrumbsLabel"
          :href="item.link"
        >
          {{ item.label }}
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator class="breadcrumbsSeparator">
          <Icon name="carbon:chevron-right" />
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
