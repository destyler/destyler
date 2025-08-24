<script lang="ts">
  import * as edit from "@destyler/edit";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import './index.css'

  const [state, send] = useMachine(edit.machine({
    id: crypto.randomUUID(),
    placeholder: 'Type something...',
  }))

  const api = $derived(edit.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="edit-root">
  <div {...api.getAreaProps()} class="edit-area">
    <input
      {...api.getInputProps()}
      class="edit-input"
    />
    <span
      {...api.getPreviewProps()}
      class="edit-preview"
    ></span>
  </div>
  <div class="edit-actions">
    {#if api.editing}
      <button
        {...api.getSubmitTriggerProps()}
        class="edit-button-primary"
      >
        Save
      </button>
      <button
        {...api.getCancelTriggerProps()}
        class="edit-button-secondary"
      >
        Cancel
      </button>
    {:else}
      <button
        {...api.getEditTriggerProps()}
        class="edit-button-primary"
      >
        Edit
      </button>
    {/if}
  </div>
</div>

