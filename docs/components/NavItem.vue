<script setup lang="ts">
const props = defineProps<{
  link: string
  title: string
}>()

const route = useRoute()
const activeClass = computed(() => {
  if (props.link.includes(route.path.split('/')[1]))
    return 'text-op-100!'

  else
    return 'text-op-60! hover:text-op-80!'
})
</script>

<template>
  <NuxtLink :to="props.link" class="transition-colors text-#09090b dark:text-#fafafa" :class="activeClass">
    {{ props.title }}
  </NuxtLink>
</template>
