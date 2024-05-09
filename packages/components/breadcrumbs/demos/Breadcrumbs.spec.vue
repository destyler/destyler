<script setup lang="ts">
import {
  DestylerBreadcrumbsContent,
  DestylerBreadcrumbsItem,
  DestylerBreadcrumbsLabel,
  DestylerBreadcrumbsRoot,
  DestylerBreadcrumbsSeparator,
} from '../src'
</script>

<template>
  <DestylerBreadcrumbsRoot>
    <DestylerBreadcrumbsContent>
      <DestylerBreadcrumbsItem>
        <DestylerBreadcrumbsLabel>
          Home
        </DestylerBreadcrumbsLabel>
        <DestylerBreadcrumbsSeparator />
      </DestylerBreadcrumbsItem>
      <DestylerBreadcrumbsItem>
        <DestylerBreadcrumbsLabel>
          Components
        </DestylerBreadcrumbsLabel>
        <DestylerBreadcrumbsSeparator />
      </DestylerBreadcrumbsItem>
      <DestylerBreadcrumbsItem>
        <DestylerBreadcrumbsLabel>
          Breadcrumbs
        </DestylerBreadcrumbsLabel>
        <DestylerBreadcrumbsSeparator />
      </DestylerBreadcrumbsItem>
    </DestylerBreadcrumbsContent>
  </DestylerBreadcrumbsRoot>
</template>
