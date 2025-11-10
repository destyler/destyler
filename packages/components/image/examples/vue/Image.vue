<script setup lang="ts">
import { imagesData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import * as avatar from '../../index'
import '../style.css'

const images = imagesData.full
const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

const src = ref(images[0])
const showImage = ref(true)

const [state, send] = useMachine(avatar.machine({ id: useId() }))
const api = computed(() => avatar.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main class="image">
      <div v-bind="api.getRootProps()">
        <span v-bind="api.getFallbackProps()">PA</span>
        <img v-if="showImage" alt="" referrerPolicy="no-referrer" :src="src" v-bind="api.getImageProps()">
      </div>

      <div class="controls">
        <button @click="() => (src = getRandomImage())">
          Change Image
        </button>
        <button @click="() => (src = imagesData.broken)">
          Broken Image
        </button>
        <button @click="() => (showImage = !showImage)">
          Toggle Image
        </button>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
    </Toolbar>
  </Layout>
</template>
