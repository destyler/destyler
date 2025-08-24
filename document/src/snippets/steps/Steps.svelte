<script lang="ts">
  import * as steps from '@destyler/steps'
  import { normalizeProps, useMachine } from '@destyler/svelte'

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

<div {...api.getRootProps()} class={`w-70% ${className}`}>
  <div {...api.getListProps()} class="relative flex items-center justify-between">
    {#each stepsData as step, index}
      <div {...api.getItemProps({ index })} class="relative flex-1 mt-0!">
        <button
          {...api.getTriggerProps({ index })}
          class="flex w-full items-center gap-2 group"
        >
          <div
            {...api.getIndicatorProps({ index })}
            class="flex h-8 w-8 items-center justify-center rounded-full border-2
            bg-background text-foreground
            border-border transition-colors
            data-[current]:bg-primary data-[current]:text-primary-foreground
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
            data-[state=complete]:bg-primary data-[state=complete]:text-primary-foreground
            group-hover:border-primary/50
            group-focus-visible:outline-none group-focus-visible:ring-2
            group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
          >
            {index + 1}
          </div>
          <span class="text-sm font-medium text-foreground">{step.title}</span>
        </button>
        <div
          {...api.getSeparatorProps({ index })}
          class="absolute left-0 top-4 -z-10 w-full border-t-2 border-primary mt-0!"
        ></div>
      </div>
    {/each}
  </div>

  {#each stepsData as step, index}
    <div
      {...api.getContentProps({ index })}
      class="rounded-lg border border-border bg-card p-6 text-card-foreground mt-2! shadow-sm"
    >
      {step.title}
    </div>
  {/each}

  <div
    {...api.getContentProps({ index: stepsData.length })}
    class="rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-sm"
  >
    Steps Complete - Thank you for filling out the form!
  </div>

  <div class="flex justify-between pt-4 mt-0!">
    <button
      {...api.getPrevTriggerProps()}
      class="btn bg-secondary text-secondary-foreground hover:bg-secondary/90"
    >
      Back
    </button>
    <button
      {...api.getNextTriggerProps()}
      class="btn mt-0!"
    >
      Next
    </button>
  </div>
</div>
