<script setup lang="ts">
import { BackTop, Icon } from 'destyler'

const docsBody = ref()

const show = ref<boolean>(false)

onMounted(() => {
  docsBody.value = document.getElementById('docsBody')
  show.value = true
})
</script>

<template>
  <BackTop
    v-if="show"
    :listen="docsBody"
    class="fixed bottom-3 flex justify-center items-center w-10 h-10 op30 hover:op100 rounded-full hover-bg-hex-8883 transition duration-300 z-100 print:hidden"
  >
    <Icon name="radix-icons:arrow-up" />
  </BackTop>
</template>
