<script setup lang="ts">
import { DestylerPopperAnchor, DestylerPopperArrow, DestylerPopperContent, DestylerPopperRoot } from '../src'
</script>

<template>
  <DestylerPopperRoot>
    <DestylerPopperAnchor>
      Anchor
    </DestylerPopperAnchor>

    <DestylerPopperContent>
      Content

      <DestylerPopperArrow />
    </DestylerPopperContent>
  </DestylerPopperRoot>
</template>
