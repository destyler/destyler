/** @jsxImportSource solid-js */
import { dynamicControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'

import * as dynamic from '../../index'
import '../style.css'

export default function DynamicPage() {
  const controls = useControls(dynamicControls)

  const [state, send] = useMachine(
    dynamic.machine({
      id: createUniqueId(),
      value: ['React', 'Vue'],
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => dynamic.connect(state, send, normalizeProps))

  function toDashCase(str: string) {
    return str.replace(/\s+/g, '-').toLowerCase()
  }

  return (
    <Layout>
      <main>
        <input data-testid="copy-text" style={{ 'margin-bottom': '1rem' }} />
        <div {...api().getRootProps()}>
          <div>
            <For each={api().value}>
              {(value, index) => (
                <span
                  {...api().getItemProps({ index: index(), value })}
                  style="position: relative;"
                >
                  <div
                    {...api().getItemPreviewProps({ index: index(), value })}
                    data-testid={`${toDashCase(value)}-input`}
                  >
                    <span>{value}</span>
                    <button
                      {...api().getItemDeleteTriggerProps({ index: index(), value })}
                      data-testid={`${toDashCase(value)}-delete-trigger`}
                    >
                      &#x2715;
                    </button>
                  </div>
                  <input
                    {...api().getItemInputProps({ index: index(), value })}
                    data-testid={`${toDashCase(value)}-item-input`}
                  />
                </span>
              )}
            </For>
          </div>
          <input
            placeholder="Add tag..."
            {...api().getInputProps()}
          />
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
