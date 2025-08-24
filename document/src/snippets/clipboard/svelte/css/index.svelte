<script lang="ts">
  import * as clipboard from '@destyler/clipboard'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './index.css'

  const id = $props.id()

  const [state, send] = useMachine(
    clipboard.machine({
      id: id,
      value: 'https://github.com/destyler/destyler',
    })
  )

  const api = $derived(clipboard.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="clipboard-root">
  <label {...api.getLabelProps()} class="clipboard-label">
    Copy Link
  </label>
  <div {...api.getControlProps()} class="clipboard-control">
    <div class="clipboard-input-wrapper">
      <input
        {...api.getInputProps()}
        class="clipboard-input"
        readonly
      />
    </div>
    <button
      {...api.getTriggerProps()}
      class="clipboard-trigger"
    >
      {#if api.copied}
        <div class="clipboard-icon-copied i-carbon:checkmark" ></div>
      {:else}
        <div class="clipboard-icon-copy i-carbon:copy" ></div>
      {/if}
    </button>
  </div>
</div>
