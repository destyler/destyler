/** @jsxImportSource solid-js */
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './style.css'

export default function DynamicPage() {
  const [state, send] = useMachine(
    dynamic.machine({
      id: createUniqueId(),
      value: ['Solid', 'Destyler'],
    }),
  )

  const api = createMemo(() => dynamic.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()}>
        <div class="flex flex-wrap gap-2 mb-4">
          <For each={api().value}>
            {(value, index) => (
              <span {...api().getItemProps({ index: index(), value })}>
                <div {...api().getItemPreviewProps({ index: index(), value })}>
                  <span>{value}</span>
                  <button {...api().getItemDeleteTriggerProps({ index: index(), value })} />
                </div>
                <input {...api().getItemInputProps({ index: index(), value })} />
              </span>
            )}
          </For>
        </div>
        <div class="relative">
          <input placeholder="Add tag..." {...api().getInputProps()} />
        </div>
      </div>
    </>
  )
}
