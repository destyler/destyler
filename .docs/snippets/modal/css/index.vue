<script setup lang="ts">
import { Icon } from '@destyler/icon'
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
} from '@destyler/modal'
import './style.css'
</script>

<template>
  <ModalRoot>
    <ModalTrigger
      class="modal-trigger"
    >
      Open Modal
    </ModalTrigger>
    <ModalPortal>
      <ModalOverlay class="modal-overlay" />
      <ModalContent class="modal-content">
        <div class="heading">
          <ModalTitle class="modal-title">
            <Icon name="carbon:warning" class="icon" />
            <span class="ml-1">Are you absolutely sure?</span>
          </ModalTitle>
          <ModalDescription class="modal-description">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </ModalDescription>
        </div>
        <div class="footer">
          <ModalCancel class="modal-cancel">
            Cancel
          </ModalCancel>
          <ModalAction class="modal-action">
            Continue
          </ModalAction>
        </div>
      </ModalContent>
    </ModalPortal>
  </ModalRoot>
</template>
