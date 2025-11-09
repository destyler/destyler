<script lang="ts">
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { stepsControls, stepsData } from '@destyler/shared-private'
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import * as steps from "../../index"
  import '../style.css'

  const controls = useControls(stepsControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(
    steps.machine({
      id: id,
      count: stepsData.length,
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(steps.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <div {...api.getListProps()}>
        {#each stepsData as step, index}
          <div {...api.getItemProps({ index })}>
            <button {...api.getTriggerProps({ index })}>
              <div {...api.getIndicatorProps({ index })}>{index + 1}</div>
              <span>{step.title}</span>
            </button>
            <div {...api.getSeparatorProps({ index })} ></div>
          </div>
        {/each}
      </div>
      {#each stepsData as step, index}
        <div {...api.getContentProps({ index })}>
          {step.title}
          {' '}
          -
          {' '}
          {step.description}
        </div>
      {/each}
      <div {...api.getContentProps({ index: stepsData.length })}>
        Steps Complete - Thank you for filling out the form!
      </div>
      <div>
        <button {...api.getPrevTriggerProps()}>Back</button>
        <button {...api.getNextTriggerProps()}>Next</button>
      </div>
    </div>
  </main>

<Toolbar {controls} viz>
  <StateVisualizer state={snapshot} omit={["previousPanels", "initialSize"]} />
</Toolbar>
</Layout>
