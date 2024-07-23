<script setup lang="ts">
import NavigationMenu from './components/NavigationMenu.vue'
</script>

<template>
  <Story title="Navigation/Chromatic" :layout="{ type: 'grid', width: '50%', iframe: false }">
    <Variant title="Default">
      <NavigationMenu />
    </Variant>

    <Variant title="Disabled click trigger">
      <NavigationMenu disable-click-trigger />
    </Variant>

    <Variant title="Disabled hover trigger">
      <NavigationMenu disable-hover-trigger />
    </Variant>
  </Story>
</template>
