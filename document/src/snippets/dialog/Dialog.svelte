<script lang="ts">
  import * as dialog from '@destyler/dialog'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  const id = $props.id()

  const [state, send] = useMachine(dialog.machine({ id }))

  const api = $derived(dialog.connect(state, send, normalizeProps))
</script>

<button {...api.getTriggerProps()} class="btn">
  Open Dialog
</button>

{#if api.open}
  <div use:portal>
    <div
      {...api.getBackdropProps()}
      class="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm"
    ></div>
    <div
      {...api.getPositionerProps()}
      class="fixed z-101 inset-0 flex items-center justify-center"
    >
      <div
        {...api.getContentProps()}
        class="bg-background border border-border! shadow-lg rounded-lg w-full max-w-md relative p-6"
      >
        <h2
          {...api.getTitleProps()}
          class="text-lg font-semibold text-foreground mb-4"
        >
          Edit profile
        </h2>
        <p
          {...api.getDescriptionProps()}
          class="text-muted-foreground mb-6"
        >
          Make changes to your profile here. Click save when you are done.
        </p>
        <button
          {...api.getCloseTriggerProps()}
          class="absolute right-4 top-4 rounded-sm opacity-70
          transition-opacity hover:opacity-100"
        >
          <div class="w-4 h-4 i-carbon:close-large" ></div>
        </button>
        <input
          placeholder="Enter name..."
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
        <button class="btn mt-4 w-full justify-center">
          Save Changes
        </button>
      </div>
    </div>
  </div>
{/if}
