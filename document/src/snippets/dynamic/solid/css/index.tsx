/** @jsxImportSource solid-js */
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'

export default function DynamicPage() {
  const [state, send] = useMachine(
    dynamic.machine({
      id: createUniqueId(),
      value: ['Solid', 'Vue'],
    }),
  )

  const api = createMemo(() => dynamic.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="dynamic-root">
        <div class="dynamic-tag-container">
          <For each={api().value}>
            {(value, index) => (
              <span
                {...api().getItemProps({ index: index(), value })}
                class="dynamic-tag-item"
              >
                <div
                  {...api().getItemPreviewProps({ index: index(), value })}
                  class="dynamic-tag-preview"
                >
                  <span class="dynamic-tag-name">{value}</span>
                  <button
                    {...api().getItemDeleteTriggerProps({ index: index(), value })}
                    class="dynamic-delete-button"
                  />
                </div>
                <input
                  {...api().getItemInputProps({ index: index(), value })}
                  class="dynamic-tag-input"
                />
              </span>
            )}
          </For>
        </div>
        <div class="dynamic-input-container">
          <input
            placeholder="Add tag..."
            {...api().getInputProps()}
            class="dynamic-input"
          />
        </div>
      </div>
    </>
  )
}
