<script setup lang="ts">
import { ref } from 'vue'
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from '../src'

const hoverState = ref(false)
</script>

<template>
  <HoverCardRoot v-model:open="hoverState" :open-delay="100">
    <HoverCardTrigger
      href="https://github.com/destyler"
      target="_blank"
      rel="noreferrer noopener"
    >
      <img
        src="https://avatars.githubusercontent.com/u/143371546?v=4"
        alt="Destyler ui"
      >
    </HoverCardTrigger>
    <HoverCardPortal>
      <Transition name="fade">
        <HoverCardContent
          :side-offset="5"
          as-child
        >
          <div>
            <div>
              <img
                src="https://avatars.githubusercontent.com/u/143371546?v=4"
                alt="Destyler ui"
              >
              <div>
                <div>
                  <div>
                    Destyler
                  </div>
                  <div>
                    @destyler_ui
                  </div>
                </div>
                <div>
                  unstyled component for vue.
                </div>
                <div>
                  <div>
                    <div>
                      0
                    </div>
                    <div>
                      Following
                    </div>
                  </div>
                  <div>
                    <div>
                      8,900
                    </div>
                    <div>
                      Followers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <HoverCardArrow :width="8" />
          </div>
        </HoverCardContent>
      </Transition>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
