<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
import { version as epVersion } from 'element-plus'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <el-input v-model="msg" />

  <p>
    Element Plus {{ epVersion }} + Vue {{ vueVersion }}
  </p>
</template>
