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
  <Story title="Back Top/Default">
    <Variant title="default">
      <div class="text-dark dark:text-light">
        <div v-if="show">
          <BackTop :listen="scrollContainerRef">
            <button class="w-sm h-sm p-3 cursor-pointer bg-green8 hover:bg-green3 rounded-md">
              back top
            </button>
          </BackTop>
        </div>
        <div id="scrollContainerRef" class="mt-2" style="overflow: auto; height: 72px; line-height: 1.5">
          <div v-for="i in 100" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
