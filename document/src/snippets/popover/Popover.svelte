<script lang="ts">
  import * as popover from '@destyler/popover'
  import { normalizeProps, useMachine,portal } from '@destyler/svelte'

  let buttonRef: HTMLInputElement | null = null

  const id = $props.id()
  
  const [state, send] = useMachine(popover.machine({ 
    id ,
    initialFocusEl: ()=> buttonRef,
  }))
  
  const api = $derived(popover.connect(state, send, normalizeProps))
</script>

<div class=" mt-0!">
  <button
    {...api.getTriggerProps()}
    class="btn"
  >
    Open popover
  </button>

  {#if api.open}
    <div use:portal>
      <div {...api.getPositionerProps()} class="z-50">
        <div
          {...api.getContentProps()}
          class="z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none"
        >
          <div
            {...api.getTitleProps()}
            class="text-sm font-medium mb-2"
          >
            Presenters
          </div>
  
          <div
            {...api.getDescriptionProps()}
            class="text-sm text-muted-foreground mb-4"
          >
            Description
          </div>
  
          <button
            bind:this={buttonRef}
            class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
          >
            Action Button
          </button>
  
          <button
            {...api.getCloseTriggerProps()}
            class="absolute top-3.5 right-3.5 bg-muted-foreground/70!
            hover:bg-muted-foreground i-carbon:close-large rounded-sm
            opacity-70 transition-opacity
            hover:opacity-100 "
          ></button>
        </div>
      </div>
    </div>
    
  {/if}
</div>
