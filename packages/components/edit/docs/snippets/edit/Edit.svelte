<script lang="ts">
  import * as edit from "@destyler/edit";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import '@docs/styles/components/edit.css'

  const [state, send] = useMachine(edit.machine({
    id: crypto.randomUUID(),
    placeholder: 'Type something...',
  }))

  const api = $derived(edit.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} >
  <div {...api.getAreaProps()} >
    <input {...api.getInputProps()} />
    <span {...api.getPreviewProps()}></span>
  </div>
  <div class="flex justify-end gap-2 mt-0!">
    {#if api.editing}
      <button {...api.getSubmitTriggerProps()} >
        Save
      </button>
      <button {...api.getCancelTriggerProps()} >
        Cancel
      </button>
    {:else}
      <button {...api.getEditTriggerProps()}>
        Edit
      </button>
    {/if}
  </div>
</div>

