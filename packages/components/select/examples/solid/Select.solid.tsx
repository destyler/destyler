/** @jsxImportSource solid-js */

import { selectControls, selectData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, Index } from 'solid-js'
import { Portal } from 'solid-js/web'
import * as select from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(selectControls)

  const [state, send] = useMachine(
    select.machine({
      collection: select.collection({ items: selectData }),
      id: createUniqueId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => select.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          {/* control */}
          <div {...api().getControlProps()}>
            <label {...api().getLabelProps()}>Label</label>
            <button {...api().getTriggerProps()}>
              {api().valueAsString || 'Select option'}
              <span {...api().getIndicatorProps()}>▼</span>
            </button>
          </div>

          <form>
            {/* Hidden select */}
            <select {...api().getHiddenSelectProps()}>
              <Index each={selectData}>{option => <option value={option().value}>{option().label}</option>}</Index>
            </select>
          </form>

          {/* UI select */}
          <Portal>
            <div {...api().getPositionerProps()}>
              <ul {...api().getContentProps()}>
                <Index each={selectData}>
                  {item => (
                    <li {...api().getItemProps({ item: item() })}>
                      <span {...api().getItemTextProps({ item: item() })}>{item().label}</span>
                      <span {...api().getItemIndicatorProps({ item: item() })}>✓</span>
                    </li>
                  )}
                </Index>
              </ul>
            </div>
          </Portal>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['collection']} />
      </Toolbar>
    </Layout>
  )
}
