<script setup lang="ts">
const props = defineProps<{
  tocList?: any
}>()
const route = useRoute()
</script>

<template>
  <ul class="m-0 list-none">
    <li v-for="toc in props.tocList" :key="toc.id" class="mt-0 pt-2">
      <a
        class="inline-block no-underline transition-colors text-#09090b dark:text-#fafafa cursor-pointer"
        :class="{
          'text-op-100!': `#${toc.id}` === route.hash,
          'text-op-60! hover:text-op-80!': `#${toc.id}` !== route.hash,
        }"
        :to="`#${toc.id}`"
      >
        {{ toc.text }}
        <template v-if="toc.children !== undefined">
          <TocItem class="ml-4" :toc-list="toc.children" />
        </template>
      </a>
    </li>
  </ul>
</template>
