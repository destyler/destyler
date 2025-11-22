<script lang="ts">
  import * as tour from '../../index'
  import { normalizeProps, portal, useMachine } from '@destyler/svelte'
  import { tourControls, tourData } from '@destyler/shared-private'
  import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(tourControls)

  const [state, send] = useMachine(
    tour.machine({
      id: 'tour:svelte',
      steps: tourData,
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(tour.connect(state, send, normalizeProps))
  const iframeContent = `<div class="tour__frame-inner"><h1 id="step-2a">Iframe Content</h1><p>Tours can highlight nodes rendered inside other documents.</p><p>Floating UI handles cross-document measurements for us.</p></div>`
</script>

<Layout>
  <main class="tour">
    <section>
      <button class="tour__start" onclick={() => api.start()}>
        Start Tour
      </button>

      <div class="steps__container">
        <h3 id="step-1">Step 1 · Welcome</h3>

        <div class="overflow__container">
          <div class="h-200px"></div>
          <h3 id="step-2">Step 2 · Scroll-aware</h3>
          <div class="h-100px"></div>
        </div>

        <iframe class="tour__frame" title="tour-frame" srcdoc={iframeContent}></iframe>

        <h3 id="step-3">Step 3 · Normal flow</h3>
        <h3 id="step-4">Step 4 · Near the bottom</h3>
      </div>
    </section>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={state} omit={['steps']} />
  </Toolbar>
</Layout>

{#if api.open && api.step}
  <div use:portal>
    <div>
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
          <div {...api.getProgressTextProps()}>{api.getProgressText()}</div>

          {#if api.step.actions?.length}
            <div class="tour button__group">
              {#each api.step.actions as action}
                <button {...api.getActionTriggerProps({ action })}>{action.label}</button>
              {/each}
            </div>
          {/if}

          <button {...api.getCloseTriggerProps()}>
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
