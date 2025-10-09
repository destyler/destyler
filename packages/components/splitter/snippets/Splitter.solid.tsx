/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as splitter from '@destyler/splitter'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function SplitterDemo() {
  const [state, send] = useMachine(
    splitter.machine({
      id: createUniqueId(),
      size: [
        { id: 'a', size: 30, minSize: 15 },
        { id: 'b', size: 70, minSize: 0 },
      ],
    }),
  )

  const api = createMemo(() => splitter.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()}>
        <div {...api().getPanelProps({ id: 'a' })} class="bg-muted/50">
          <div class="text-center p-12 whitespace-nowrap">
            <p class="text-card-foreground font-semibold text-2xl mb-2">One</p>
          </div>
        </div>
        <div {...api().getResizeTriggerProps({ id: 'a:b' })} class="group">
          <div />
          <div />
        </div>
        <div
          {...api().getPanelProps({ id: 'b' })}
          class="bg-card"
        >
          <div class="text-center p-12 whitespace-nowrap">
            <p class="text-card-foreground font-semibold text-2xl mb-2">Two</p>
          </div>
        </div>
      </div>
    </>
  )
}
