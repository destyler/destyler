<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
import {DestylerButton} from '@destyler/button'

const msg = ref('Hello World!')

function handleClick(){
alert(msg.value)
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <DestylerButton @click="handleClick"> hello </DestylerButton>

  <p>
    Vue {{ vueVersion }}
  </p>
</template>
