<script lang="ts">
  import { tabsControls, tabsData } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import * as tabs from "../../index"
  import '../style.css'

  const controls = useControls(tabsControls)

  const [snapshot, send] = useMachine(
    tabs.machine({
      id: "1",
      value: "nils",
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(tabs.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <div {...api.getIndicatorProps()}></div>
      <div {...api.getListProps()}>
        {#each tabsData as data}
          <button {...api.getTriggerProps({ value: data.id })} data-testid={`${data.id}-tab`}>
            {data.label}
          </button>
        {/each}
      </div>

      {#each tabsData as data}
        <div {...api.getContentProps({ value: data.id })} data-testid={`${data.id}-tab-panel`}>
          <p>{data.content}</p>
          {#if data.id === "agnes"}
            <input placeholder="Agnes" />
          {/if}
        </div>
      {/each}
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
