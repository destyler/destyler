<script lang="ts">
  import { toggleControls, toggleData } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import * as toggle from "../../index"
  import '../style.css'

  const controls = useControls(toggleControls)

  const [snapshot, send] = useMachine(toggle.machine({ id: "1" }), {
    context: controls.context,
  })

  const api = $derived(toggle.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main class="toggle-group">
    <button>Outside</button>
    <div {...api.getRootProps()}>
      {#each toggleData as item}
        <button {...api.getItemProps({ value: item.value })}>
          {item.label}
        </button>
      {/each}
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
