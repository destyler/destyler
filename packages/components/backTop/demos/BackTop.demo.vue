<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BackTop } from '../src'

const scrollContainerRef = ref()

const show = ref<boolean>(false)

onMounted(() => {
  scrollContainerRef.value = document.getElementById('scrollContainerRef')
  show.value = true
})
</script>

<template>
  <div class="text-dark dark:text-light">
    <div v-if="show">
      <BackTop :listen="scrollContainerRef">
        back top
      </BackTop>
    </div>
    <div id="scrollContainerRef" style="overflow: auto; height: 72px; line-height: 1.5">
      <div v-for="i in 100" :key="i">
        {{ i }}
      </div>
    </div>
  </div>
</template>
