<script lang="ts">
  import * as edit from "@destyler/edit";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { editControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/edit.css'

  const controls = useControls(editControls);

  const [state, send] = useMachine(edit.machine({
    id: crypto.randomUUID(),
    value: 'Hello World',
    placeholder: 'Type something...',
  }))

  const api = $derived(edit.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="edit-root">
  <div {...api.getAreaProps()} class="edit-area">
    <input
      data-testid="input"
      {...api.getInputProps()}
      class="edit-input"
    />
    <span
      data-testid="preview"
      {...api.getPreviewProps()}
      class="edit-preview"
    ></span>
  </div>
  <div class="edit-actions-box space-x-2">
    {#if api.editing}
      <div class="space-x-2">
        <button
          data-testid="save:trigger"
          {...api.getSubmitTriggerProps()}
        >
          Save
        </button>
        <button
          data-testid="cancel:trigger"
          {...api.getCancelTriggerProps()}
        >
          Cancel
        </button>
      </div>
    {:else}
      <button
        data-testid="edit:trigger"
        {...api.getEditTriggerProps()}
      >
        Edit
      </button>
    {/if}
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
