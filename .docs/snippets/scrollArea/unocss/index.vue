<script setup lang="ts">
import { Divider } from '@destyler/divider'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@destyler/scroll-area'
</script>

<template>
  <ScrollAreaRoot
    relative="~"
    overflow="hidden"
    h="72"
    w="48"
    rounded="md"
    border="~"
  >
    <ScrollAreaViewport
      h="full"
      w="full"
      rounded="inherit"
    >
      <div p="4">
        <h4
          m="b-4! t-0!"
          text="lg dark dark:text-light"
          font="medium"
          leading="none"
        >
          Tags
        </h4>
        <template v-for="i in 50" :key="i">
          <div
            text="base dark dark:text-light"
          >
            v0.0.0-beta.{{ 51 - i }}
          </div>
          <Divider
            bg="primary/50"
            m="y-2"
            h="data-[orientation=horizontal]:px data-[orientation=vertical]:full"
            w="data-[orientation=horizontal]:full data-[orientation=vertical]:px"
          />
        </template>
      </div>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      flex="~"
      touch="none"
      select="none"
      transition="colors"
      h="full"
      w="2.5"
      border="l l-transparent"
      p="1px"
    >
      <ScrollAreaThumb
        relative="~"
        flex="1"
        rounded="full"
        bg="border"
      />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
