<script lang="ts">
  import * as tour from "@destyler/tour";
  import { useMachine, normalizeProps } from "@destyler/svelte";

  const steps: tour.StepDetails[] = [
    {
      type: 'dialog',
      id: 'start',
      title: 'Ready to go for a ride',
      description: "Let's take the tour component for a ride and have some fun!",
      actions: [{ label: "Let's go!", action: 'next' }],
    },
    {
      type: 'dialog',
      id: 'logic',
      title: 'Statechart',
      description: `As an engineer, you'll learn about the internal statechart that powers the tour.`,
      actions: [
        { label: 'Prev', action: 'prev' },
        { label: 'Next', action: 'next' },
      ],
    },
    {
      type: 'dialog',
      id: 'end',
      title: 'Amazing! You got to the end',
      description: 'Like what you see? Now go ahead and use it in your project.',
      actions: [{ label: 'Finish', action: 'dismiss' }],
    },
  ];

  const id = $props.id()

  const [state, send] = useMachine(tour.machine({ id, steps }));

  const api = $derived(tour.connect(state, send, normalizeProps));
  const open = $derived(api.open && api.step);
</script>

<div>
  <button on:click={() => api.start()}>Start Tour</button>
  <div id="step-1">Step 1</div>
</div>

{#if open}
  <div class="portal">
    {#if api.step?.backdrop}
      <div {...api.getBackdropProps()} ></div>
    {/if}
    <div {...api.getSpotlightProps()} ></div>
    <div {...api.getPositionerProps()} class="fixed">
      <div {...api.getContentProps()}>
        {#if api.step?.arrow}
          <div {...api.getArrowProps()}>
            <div {...api.getArrowTipProps()} ></div>
          </div>
        {/if}

        <p {...api.getTitleProps()}>{api.step?.title}</p>
        <div {...api.getDescriptionProps()}>{api.step?.description}</div>
        <div {...api.getProgressTextProps()}>
          {api.getProgressText()}
        </div>

        {#if api.step?.actions}
          <div class="tour button__group">
            {#each api.step?.actions as action (action.label)}
              <button {...api.getActionTriggerProps({ action })}>
                {action.label}
              </button>
            {/each}
          </div>
        {/if}

        <button {...api.getCloseTriggerProps()}>X</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .portal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .fixed {
    position: fixed;
    pointer-events: auto;
  }
</style>
