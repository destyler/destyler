<script lang="ts">
  import * as radio from "../../index"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { radioControls, radioData } from "@destyler/shared-private"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(radioControls)

  const [snapshot, send] = useMachine(radio.machine({ id: "1", name: "fruit" }), {
    context: controls.context,
  })

  const api = $derived(radio.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <fieldset disabled={false}>
      <div {...api.getRootProps()}>
        <h3 {...api.getLabelProps()}>Fruits</h3>
        <div {...api.getIndicatorProps()}></div>
        {#each radioData as opt}
          <label data-testid={`radio-${opt.id}`} {...api.getItemProps({ value: opt.id })}>
            <div data-testid={`control-${opt.id}`} {...api.getItemControlProps({ value: opt.id })}></div>
            <span data-testid={`label-${opt.id}`} {...api.getItemTextProps({ value: opt.id })}>
              {opt.label}
            </span>
            <input data-testid={`input-${opt.id}`} {...api.getItemHiddenInputProps({ value: opt.id })} />
          </label>
        {/each}
      </div>
      <button type="reset">Reset</button>
      <button type="button" onclick={() => api.clearValue()}> Clear </button>
      <button type="button" onclick={() => api.setValue("mango")}> Set to Mangoes </button>
      <button type="button" onclick={() => api.focus()}> Focus </button>
    </fieldset>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>

</Layout>
