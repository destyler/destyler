<script lang="ts">
import { collapseControls, collapseData } from '@destyler/shared-private'
import { useControls, Toolbar, StateVisualizer, Layout } from '@destyler/shared-private/svelte'
import { normalizeProps, useMachine } from '@destyler/svelte'
import * as collapse from '../../index'
import '../style.css'

const controls = useControls(collapseControls)

const id = $props.id();

const [state, send] = useMachine(collapse.machine({
  id,
}), {
  context: controls.context,
})

const api = $derived(collapse.connect(state, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      {#each collapseData as item (item.id)}
        <div {...api.getItemProps({ value: item.id })}>
          <h3>
            <button data-testid="{item.id}:trigger" {...api.getItemTriggerProps({ value: item.id })}>
              {item.title}
              <div {...api.getItemIndicatorProps({ value: item.id })}>
                &gt;
              </div>
            </button>
          </h3>
          <div {...api.getItemContentProps({ value: item.id })} data-testid="{item.id}:content">
            {item.content}
          </div>
        </div>
      {/each}
    </div>
  </main>
  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
