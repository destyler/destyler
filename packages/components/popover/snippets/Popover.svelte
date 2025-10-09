<script lang="ts">
  import * as popover from '@destyler/popover'
  import { normalizeProps, useMachine,portal } from '@destyler/svelte'
  import './style.css'

  let buttonRef: HTMLInputElement | null = null

  const id = $props.id()

  const [state, send] = useMachine(popover.machine({
    id ,
    initialFocusEl: ()=> buttonRef,
  }))

  const api = $derived(popover.connect(state, send, normalizeProps))
</script>

<div class=" mt-0!" data-layout="sinppets">
  <button {...api.getTriggerProps()}>
    Open popover
  </button>

  {#if api.open}
    <div use:portal>
      <div {...api.getPositionerProps()} data-layout="sinppets">
        <div {...api.getContentProps()}>
          <div {...api.getTitleProps()}>
            Presenters
          </div>

          <div {...api.getDescriptionProps()}>
            Description
          </div>

          <button
            bind:this={buttonRef}
            class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
          >
            Action Button
          </button>

          <button {...api.getCloseTriggerProps()}></button>
        </div>
      </div>
    </div>

  {/if}
</div>
