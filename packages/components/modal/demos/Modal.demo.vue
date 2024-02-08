<script setup lang="ts">
import {
  DestylerModalCancel,
  DestylerModalContent,
  DestylerModalOverlay,
  DestylerModalPortal,
  DestylerModalRoot,
  DestylerModalTrigger,
} from '../src'
</script>

<template>
  <DestylerModalRoot>
    <DestylerModalTrigger as-child>
      <button>
        Open
      </button>
    </DestylerModalTrigger>
    <DestylerModalPortal>
      <DestylerModalOverlay />
      <DestylerModalContent>
        <div>
          11
        </div>
        <div>
          <DestylerModalCancel>
            cancel
          </DestylerModalCancel>
        </div>
      </DestylerModalContent>
    </DestylerModalPortal>
  </DestylerModalRoot>
</template>
