<script setup lang="ts">
import { ref } from 'vue'
import {
  ModalAction,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalRoot,
  ModalTitle,
  ModalTrigger,
} from '../src'

const isOpen = ref(false)
</script>

<template>
  <ModalRoot v-model:open="isOpen">
    <ModalTrigger>
      Open
    </ModalTrigger>
    <ModalPortal>
      <ModalOverlay />
      <ModalContent>
        <ModalTitle>
          Title
        </ModalTitle>
        <ModalDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </ModalDescription>
        <button>hihi</button>
        <div>
          <ModalCancel>
            Cancel
          </ModalCancel>
          <ModalAction>
            Yes, delete account
          </ModalAction>
        </div>
      </ModalContent>
    </ModalPortal>
  </ModalRoot>
</template>
