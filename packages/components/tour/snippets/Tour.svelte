<script lang="ts">
  import * as tour from "@destyler/tour";
  import { useMachine, normalizeProps, portal } from "@destyler/svelte";
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(tour.machine({
    id: id,
    steps: [
      {
        type: 'dialog',
        id: 'step-0',
        title: 'Starting Point',
        description: 'Click the start button to begin the tour.',
        actions: [{ label: 'Next', action: 'next' }],
      },
      {
        type: 'tooltip',
        id: 'step-1',
        title: 'Welcome',
        description: 'this is the first step of the tour.',
        target: () => document.querySelector<HTMLElement>('#_top'),
        actions: [
          { label: 'Prev', action: 'prev' },
          { label: 'Next', action: 'next' },
        ],
      },
      {
        type: 'tooltip',
        id: 'step-2',
        title: 'What is a tour?',
        description: 'A tour is a series of steps that guide users through your app.',
        target: () => document.querySelector<HTMLElement>('#what-is-a-tour'),
        actions: [
          { label: 'Prev', action: 'prev' },
          { label: 'Next', action: 'next' },
        ],
      },
      {
        type: 'dialog',
        id: 'step-5',
        title: 'Amazing! You got to the end',
        description: 'Like what you see? Now go ahead and use it in your project.',
        actions: [{ label: 'Finish', action: 'dismiss' }],
      },
    ],
  }))

  const api = $derived(tour.connect(state, send, normalizeProps))
</script>

<button class="btn" onclick={() => api.start()}>Start Tour</button>

{#if api.open && api.step}
  <div use:portal>
    <div data-layout="sinppets">
      {#if api.step.backdrop}
        <div {...api.getBackdropProps()}></div>
      {/if}
      <div {...api.getSpotlightProps()}></div>
      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          {#if api.step.arrow}
            <div {...api.getArrowProps()}>
              <div {...api.getArrowTipProps()}></div>
            </div>
          {/if}
          <p {...api.getTitleProps()}>{api.step.title}</p>
          <div {...api.getDescriptionProps()}>{api.step.description}</div>
          {#if api.step.actions}
            <div class="flex justify-end gap-2">
              {#each api.step.actions as action}
                <button {...api.getActionTriggerProps({ action })}>{action.label}</button>
              {/each}
            </div>
          {/if}
          <button {...api.getCloseTriggerProps()}>
            <div class="i-ph:x-bold" ></div>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
