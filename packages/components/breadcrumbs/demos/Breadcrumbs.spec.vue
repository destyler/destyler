<script setup lang="ts">
import {
  BreadcrumbsContent,
  BreadcrumbsItem,
  BreadcrumbsLabel,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
} from '../src'
</script>

<template>
  <BreadcrumbsRoot>
    <BreadcrumbsContent>
      <BreadcrumbsItem>
        <BreadcrumbsLabel>
          Home
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator />
      </BreadcrumbsItem>
      <BreadcrumbsItem>
        <BreadcrumbsLabel>
          Components
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator />
      </BreadcrumbsItem>
      <BreadcrumbsItem>
        <BreadcrumbsLabel>
          Breadcrumbs
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator />
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
