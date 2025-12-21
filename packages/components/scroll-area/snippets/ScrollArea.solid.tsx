/** @jsxImportSource solid-js */
import * as scrollArea from '@destyler/scroll-area'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './style.css'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

export default function ScrollArea() {
  const [state, send] = useMachine(scrollArea.machine({ id: createUniqueId() }))

  const api = createMemo(() => scrollArea.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <div {...api().getViewportProps()}>
        <div {...api().getContentProps()}>
          <div class="scroll-area-header">Tags</div>
          <For each={tags}>
            {tag => (
              <div class="scroll-area-item">
                {tag}
              </div>
            )}
          </For>
        </div>
      </div>

      <div {...api().getScrollbarProps({ orientation: 'vertical' })}>
        <div {...api().getThumbProps({ orientation: 'vertical' })} />
      </div>

      <div {...api().getScrollbarProps({ orientation: 'horizontal' })}>
        <div {...api().getThumbProps({ orientation: 'horizontal' })} />
      </div>

      <div {...api().getCornerProps()} />
    </div>
  )
}
