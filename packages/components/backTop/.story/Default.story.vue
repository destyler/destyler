<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BackTop } from '../src'

export default defineComponent({
  components: {
    BackTop,
  },
  setup() {
    const scrollContainerRef = ref<HTMLElement | undefined>(undefined)
    return {
      scrollContainer: scrollContainerRef,
      target: () => scrollContainerRef.value,
    }
  },
})
</script>

<template>
  <Story title="Back Top/Default">
    <Variant title="listen">
      <div class="text-dark dark:text-light">
        <div>
          <BackTop class="w-sm h-sm p-3 cursor-pointer bg-green8 hover:bg-green3 rounded-md">
            back top
          </BackTop>
        </div>
        <div ref="scrollContainer" class="mt-2" style="overflow: auto; height: 72px; line-height: 1.5">
          <div v-for="i in 100" :key="i">
            {{ i }}
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
