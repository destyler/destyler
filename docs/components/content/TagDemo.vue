<script setup lang="ts">
import { DestylerTag } from '@destyler/tag/src/tag'
</script>

<template>
  <DestylerTag>
    Tag
  </DestylerTag>
</template>

<style>
[destyler="tag"]{
  color: white;
  width: 4rem;
  display: flex;
  --un-shadow: var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgb(128 128 128 / 0.1)), var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgb(128 128 128 / 0.1));
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color:#e9f3ec;
  color: #4b9e5f;
  border-radius: 0.25rem;
  padding: 0.25rem;
}
.dark [destyler="tag"]{
  background-color:#2a3836;
  color: #86dfba;

}
</style>
