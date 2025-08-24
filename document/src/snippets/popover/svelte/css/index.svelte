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

<div class="popover-container">
  <button
    {...api.getTriggerProps()}
    class="popover-trigger"
  >
    Open popover
  </button>

  {#if api.open}
    <div use:portal>
      <div {...api.getPositionerProps()} class="popover-positioner">
        <div
          {...api.getContentProps()}
          class="popover-content"
        >
          <div
            {...api.getTitleProps()}
            class="popover-title"
          >
            Presenters
          </div>
  
          <div
            {...api.getDescriptionProps()}
            class="popover-description"
          >
            Description
          </div>
  
          <button
            bind:this={buttonRef}
            class="popover-action-button"
          >
            Action Button
          </button>
  
          <button
            {...api.getCloseTriggerProps()}
            class="popover-close-button i-carbon:close-large"
          ></button>
        </div>
      </div>
    </div>
    
  {/if}
</div>
