<script lang="ts">
  import { tourControls, tourData } from '@destyler/shared-private'
  import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
  import * as tour from "@destyler/tour";
  import { useMachine, normalizeProps, portal } from "@destyler/svelte";
  import Iframe from '../components/Iframe.svelte'
  import '@destyler/shared-private/styles/tour.css'

  const controls = useControls(tourControls)

  const [state, send] = useMachine(tour.machine({ id: "1", steps: tourData }), {
    context: controls.context,
  })

  const api = $derived(tour.connect(state, send, normalizeProps))
</script>

<main class="tour">
  <div>
    <button onclick={() => api.start()}>Start Tour</button>
    <div class="steps__container">
      <h3 id="step-1">Step 1</h3>
      <div class="overflow__container">
        <div class="h-200px"></div>
        <h3 id="step-2">Step 2</h3>
        <div class="h-100px"></div>
      </div>
      <Iframe>
        <h1 id="step-2a">Iframe Content</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
      </Iframe>
      <h3 id="step-3">Step 3</h3>
      <h3 id="step-4">Step 4</h3>
    </div>
  </div>

  {#if api.open && api.step}
    <div use:portal>
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
            <div class="tour button__group">
              {#each api.step.actions as action}
                <button {...api.getActionTriggerProps({ action })}>{action.label}</button>
              {/each}
            </div>
          {/if}
          <button {...api.getCloseTriggerProps()}>
            x
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
