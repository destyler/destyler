<script lang="ts">
  import * as dialog from '@destyler/dialog'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(dialog.machine({ id }))

  const api = $derived(dialog.connect(state, send, normalizeProps))
</script>

<button {...api.getTriggerProps()}>
  Open Dialog
</button>

{#if api.open}
  <div data-layout="sinppets" use:portal>
    <div {...api.getBackdropProps()} ></div>
    <div {...api.getPositionerProps()}>
      <div {...api.getContentProps()}>
        <h2 {...api.getTitleProps()}>
          Edit profile
        </h2>
        <p {...api.getDescriptionProps()}>
          Make changes to your profile here. Click save when you are done.
        </p>
        <button {...api.getCloseTriggerProps()}>
          <div ></div>
        </button>
        <input placeholder="Enter name...">
        <button >
          Save Changes
        </button>
      </div>
    </div>
  </div>
{/if}
