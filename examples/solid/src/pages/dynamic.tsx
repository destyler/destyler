/** @jsxImportSource solid-js */
import * as dynamic from '@destyler/dynamic'
import { dynamicControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import '@destyler/shared-private/styles/dynamic.css'

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
    <>
      <input data-testid="copy-text" />
      <div {...api().getRootProps()} class="dynamic-root">
        <div class="dynamic-content">
          <For each={api().value}>
            {(value, index) => (
              <span
                {...api().getItemProps({ index: index(), value })}
                class="group"
                style="position: relative;"
              >
                <div
                  {...api().getItemPreviewProps({ index: index(), value })}
                  class="dynamic-item-preview"
                  data-testid={`${toDashCase(value)}-input`}
                >
                  <span class="dynamic-item-preview-value">{value}</span>
                  <button
                    {...api().getItemDeleteTriggerProps({ index: index(), value })}
                    class="dynamic-item-delete-trigger"
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
          class="dynamic-input"
        />
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
