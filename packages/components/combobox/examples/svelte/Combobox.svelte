<script lang="ts">
import * as combobox from '../../index'
import { normalizeProps, useMachine } from '@destyler/svelte'
import { comboboxControls, listData } from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
import '../style.css'

const controls = useControls(comboboxControls)

let options = $state.raw(listData)
const collection = combobox.collection({
  items: listData,
  itemToValue: (item) => item.code,
  itemToString: (item) => item.label,
})
controls.setContext("collection", collection)
const [snapshot, send] = useMachine(
  combobox.machine({
    id: "1",
    collection,
    onOpenChange() {
      options = listData
    },
    onInputValueChange({ inputValue }) {
      const filtered = listData.filter(item =>
        item.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      options = inputValue ? filtered : listData
    },
  }),
  {
    context: controls.context,
  },
)
const api = $derived(combobox.connect(snapshot, send, normalizeProps))
$inspect(api.inputValue)
</script>

<Layout>
  <main class="combobox">
    <div>
      <button onclick={() => api.setValue(["TG"])}>Set to Togo</button>
      <button data-testid="clear-value-button" onclick={() => api.clearValue()}> Clear Value </button>
      <button {...api.getClearTriggerProps()}>
        Clear Trigger
      </button>
      <br />
      <div {...api.getRootProps()}>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label {...api.getLabelProps()}>Select country</label>
        <div {...api.getControlProps()}>
          <input data-testid="input" {...api.getInputProps()} />
          <button data-testid="trigger" {...api.getTriggerProps()}> ▼ </button>
          <button {...api.getClearTriggerProps()}>
            x
          </button>
        </div>
      </div>
      <div {...api.getPositionerProps()}>
        {#if options.length > 0}
          <ul data-testid="combobox-content" {...api.getContentProps()}>
            {#each options as item}
              <li data-testid={item.code} {...api.getItemProps({ item })}>
                {item.label}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
