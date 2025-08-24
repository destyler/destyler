/** @jsxImportSource solid-js */
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, For } from 'solid-js'
import './index.css'

export default function Divider() {
  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id: crypto.randomUUID() }))
  const api = createMemo(() => separator.connect(state, send, normalizeProps))

  return (
    <div class="container">
      <div class="title">
        Destyler UI
      </div>
      <div class="subtitle">
        unstyled component for solid.
      </div>
      <div
        {...api().getRootProps()}
        class="separator-horizontal"
      />
      <div class="items-row">
        <For each={items}>
          {(item, index) => (
            <>
              <div class="item-label">
                {item.label}
              </div>
              {index() < items.length - 1 && (
                <div
                  {...api().getRootProps('vertical')}
                  class="separator-vertical"
                />
              )}
            </>
          )}
        </For>
      </div>
    </div>
  )
}
