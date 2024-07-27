<script setup lang="ts">
import { Link } from '../src'
</script>

<template>
  <Story title="Link/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <Link to="https://github.com/destyler" target="_blank">
        destyler ui
      </Link>
    </Variant>
  </Story>
</template>
