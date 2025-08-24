<script lang="ts">
  import * as dialog from '@destyler/dialog'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './Dialog.css';

  const id = $props.id()

  const [state, send] = useMachine(dialog.machine({ id }))

  const api = $derived(dialog.connect(state, send, normalizeProps))
</script>

<template>
  <button {...api.getTriggerProps()} class="dialog-trigger">
    Open Dialog
  </button>
  {#if api.open}
    <div use:portal>
      <div {...api.getBackdropProps()} class="dialog-backdrop" ></div>
      <div {...api.getPositionerProps()} class="dialog-positioner">
        <div {...api.getContentProps()} class="dialog-content">
          <h2 {...api.getTitleProps()} class="dialog-title">Edit profile</h2>
          <p {...api.getDescriptionProps()} class="dialog-description">
            Make changes to your profile here. Click save when you are done.
          </p>
          <button {...api.getCloseTriggerProps()} class="dialog-close-trigger">
            <div class="i-carbon:close-large" ></div>
          </button>
          <input placeholder="Enter name..." class="dialog-input" />
          <button class="dialog-action">Save Changes</button>
        </div>
      </div>
    </div>
  {/if}
</template>
