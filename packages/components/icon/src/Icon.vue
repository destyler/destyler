<script setup lang="ts">
import { computed } from 'vue'
import { Icon as Iconify } from '@iconify/vue'
import type { DestylerIconProps } from './props'

const { name } = defineProps<DestylerIconProps>()

const iconName = computed(() => name.replace(/^i-/, ''))
</script>

<template>
  <Iconify :icon="iconName" />
</template>
