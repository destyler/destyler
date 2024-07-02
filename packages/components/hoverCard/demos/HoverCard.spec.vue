<script setup lang="ts">
import { ref } from 'vue'
import {
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from '../src'

const hoverState = ref(false)
</script>

<template>
  <HoverCardRoot v-model:open="hoverState">
    <HoverCardTrigger>
      <button>
        Nuxt
      </button>
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        :side-offset="5"
      >
        <div>
          <div>
            <h4>
              nuxt.js
            </h4>
            <p>
              Nuxt is a free and open-source framework with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with Vue.js.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
