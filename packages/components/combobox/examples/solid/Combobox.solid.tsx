/** @jsxImportSource solid-js */

import { comboboxControls, listData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createSignal, createUniqueId } from 'solid-js'
import { Index, Show } from 'solid-js/web'
import * as combobox from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(comboboxControls)

  const [options, setOptions] = createSignal(listData)

  const collection = createMemo(() =>
    combobox.collection({
      items: options(),
      itemToValue: item => item.code,
      itemToString: item => item.label,
    }),
  )

  const [state, send] = useMachine(
    combobox.machine({
      id: createUniqueId(),
      collection: collection(),
      onOpenChange() {
        setOptions(listData)
      },
      onInputValueChange({ inputValue }) {
        const filtered = listData.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
        setOptions(filtered.length > 0 ? filtered : listData)
      },
    }),
    {
      context: createMemo(() => ({
        ...controls.context(),
        collection: collection(),
      })),
    },
  )

  const api = createMemo(() => combobox.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div>
          <button onClick={() => api().setValue(['TG'])}>Set to Togo</button>
          <button data-testid="clear-value-button" onClick={() => api().clearValue()}>
            Clear Value
          </button>
          <button {...api().getClearTriggerProps()}>Clear Trigger</button>
          <br />

          <div {...api().getRootProps()}>
            <label {...api().getLabelProps()}>Select country</label>
            <div {...api().getControlProps()}>
              <input data-testid="input" {...api().getInputProps()} />
              <button data-testid="trigger" {...api().getTriggerProps()}>
                ▼
              </button>
              <button {...api().getClearTriggerProps()}>
                x
              </button>
            </div>
          </div>

          <div {...api().getPositionerProps()}>
            <Show when={options().length > 0}>
              <ul data-testid="combobox-content" {...api().getContentProps()}>
                <Index each={options()}>
                  {item => (
                    <li class="combobox__option" {...api().getItemProps({ item: item() })}>
                      {item().label}
                    </li>
                  )}
                </Index>
              </ul>
            </Show>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['collection']} />
      </Toolbar>
    </Layout>
  )
}
