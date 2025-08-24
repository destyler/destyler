<script lang="ts">
  import * as steps from '@destyler/steps'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './index.css'

  const stepsData = [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]

  const [state, send] = useMachine(
    steps.machine({
      id: crypto.randomUUID(),
      count: stepsData.length,
    }),
  )

  const api = $derived(steps.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class='steps-container'>
  <div {...api.getListProps()} class="steps-list">
    {#each stepsData as step, index}
      <div {...api.getItemProps({ index })} class="steps-item">
        <button
          {...api.getTriggerProps({ index })}
          class="steps-trigger"
        >
          <div
            {...api.getIndicatorProps({ index })}
            class="steps-indicator"
          >
            {index + 1}
          </div>
          <span class="steps-title">{step.title}</span>
        </button>
        <div
          {...api.getSeparatorProps({ index })}
          class="steps-separator"
        ></div>
      </div>
    {/each}
  </div>

  {#each stepsData as step, index}
    <div
      {...api.getContentProps({ index })}
      class="steps-content"
    >
      {step.title}
    </div>
  {/each}

  <div
    {...api.getContentProps({ index: stepsData.length })}
    class="steps-content-complete"
  >
    Steps Complete - Thank you for filling out the form!
  </div>

  <div class="steps-navigation">
    <button
      {...api.getPrevTriggerProps()}
      class="btn btn-secondary"
    >
      Back
    </button>
    <button
      {...api.getNextTriggerProps()}
      class="btn btn-primary"
    >
      Next
    </button>
  </div>
</div>
