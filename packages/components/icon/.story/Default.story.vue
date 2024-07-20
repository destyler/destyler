<script setup lang="ts">
import { Icon } from '../src'
</script>

<template>
  <Story title="Icon/Demo" :layout="{ type: 'single', iframe: true }">
    <Variant title="default">
      <div class="flex">
        <Icon name="logos:vue" class="w-24 h-24 ml-2" />
        <Icon name="logos:vitejs" class="w-24 h-24 ml-2" />
      </div>
    </Variant>
  </Story>
</template>
