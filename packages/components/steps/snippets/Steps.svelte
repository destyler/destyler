<script lang="ts">
  import * as steps from '@destyler/steps'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const { className = '' } = $props()

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

<div {...api.getRootProps()} class={`${className}`}>
  <div {...api.getListProps()}>
    {#each stepsData as step, index}
      <div {...api.getItemProps({ index })}>
        <button {...api.getTriggerProps({ index })} class="group">
          <div {...api.getIndicatorProps({ index })}>
            {index + 1}
          </div>
          <span class="text-sm font-medium text-foreground">{step.title}</span>
        </button>
        <div {...api.getSeparatorProps({ index })}></div>
      </div>
    {/each}
  </div>

  {#each stepsData as step, index}
    <div {...api.getContentProps({ index })}>
      {step.title}
    </div>
  {/each}

  <div {...api.getContentProps({ index: stepsData.length })}>
    Steps Complete - Thank you for filling out the form!
  </div>

  <div class="flex justify-between pt-4 mt-0!">
    <button {...api.getPrevTriggerProps()}>
      Back
    </button>
    <button {...api.getNextTriggerProps()}>
      Next
    </button>
  </div>
</div>
