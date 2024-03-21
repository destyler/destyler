<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerHoverCardContent,
  DestylerHoverCardPortal,
  DestylerHoverCardRoot,
  DestylerHoverCardTrigger,
} from '../src'

const hoverState = ref(false)
</script>

<template>
  <DestylerHoverCardRoot v-model:open="hoverState">
    <DestylerHoverCardTrigger>
      <button>
        Nuxt
      </button>
    </DestylerHoverCardTrigger>
    <DestylerHoverCardPortal>
      <DestylerHoverCardContent
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
      </DestylerHoverCardContent>
    </DestylerHoverCardPortal>
  </DestylerHoverCardRoot>
</template>
