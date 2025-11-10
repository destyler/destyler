<script lang="ts">
  import * as select from "../../index"
  import { selectControls, selectData } from "@destyler/shared-private"
  import { normalizeProps, portal, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(selectControls)

  const [snapshot, send] = useMachine(
    select.machine({
      id: "1",
      name: "select",
      collection: select.collection({ items: selectData }),
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(select.connect(snapshot, send, normalizeProps))
</script>

<Layout>
<main>
  <div {...api.getRootProps()}>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label {...api.getLabelProps()}>Label</label>

    <div {...api.getControlProps()}>
      <button {...api.getTriggerProps()}>
        <span>{api.valueAsString || "Select option"}</span>
        <span {...api.getIndicatorProps()}>▼</span>
      </button>
      <button {...api.getClearTriggerProps()}>X</button>
    </div>

    <form>
      <select {...api.getHiddenSelectProps()}>
        {#each selectData as option}
          <option value={option.value}>
            {option.label}
          </option>
        {/each}
      </select>
    </form>

    <div use:portal {...api.getPositionerProps()}>
      <ul {...api.getContentProps()}>
        {#each selectData as item}
          <li {...api.getItemProps({ item })}>
            <span {...api.getItemTextProps({ item })}>{item.label}</span>
            <span {...api.getItemIndicatorProps({ item })}>✓</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} omit={["collection"]} />
</Toolbar>

</Layout>
