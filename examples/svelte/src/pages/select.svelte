<script lang="ts">
  import * as select from "@destyler/select"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { selectControls, listData } from '@destyler/shared-private'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/select.css'

  const controls = useControls(selectControls)

  const selectData = listData.map(item => ({
  label: item.label,
  value: item.code,
}))

  const [state, send] = useMachine(
    select.machine({
      id: crypto.randomUUID(),
      collection: select.collection({
        items: selectData,
      }),
    }), {
      context: controls.context,
    }
  )

  const api = $derived(select.connect(state, send, normalizeProps))
</script>

<div class="select-root">
  <div {...api.getControlProps()}>
    <label
      {...api.getLabelProps()}
      class="select-label"
    >
      Label
    </label>
    <button
      {...api.getTriggerProps()}
      class="select-trigger"
    >
      <span>{api.valueAsString || "Select option"}</span>
      <span class="select-trigger-icon i-carbon:chevron-right"></span>
    </button>
    <button {...api.getClearTriggerProps()}>
      X
    </button>
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
  <div
    {...api.getPositionerProps()}
    class="select-positioner"
  >
    <ul
      {...api.getContentProps()}
      class="select-content"
    >
      {#each selectData as item (item.value)}
        <li
          {...api.getItemProps({ item })}
          data-testid={`item-${item.value}`}
          class="select-item"
        >
          <span>{item.label}</span>
          <span
            {...api.getItemIndicatorProps({ item })}
            class="select-item-indicator"
          >
            ✓
          </span>
        </li>
      {/each}
    </ul>
  </div>
</div>



<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
