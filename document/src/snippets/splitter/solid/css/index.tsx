/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as splitter from '@destyler/splitter'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function SplitterDemo() {

  const [state, send] = useMachine(
    splitter.machine({
      id: createUniqueId(),
      size: [
        { id: 'a', size: 30, minSize: 15 },
        { id: 'b', size: 70, minSize: 0 },
      ],
    })
  )

  const api = createMemo(() => splitter.connect(state, send, normalizeProps))

  return (
    <div
      {...api().getRootProps()}
      class="splitter-root"
    >
      <div
        {...api().getPanelProps({ id: 'a' })}
        class="splitter-panel-a"
      >
        <div class="splitter-panel-content">
          <p class="splitter-panel-text">One</p>
        </div>
      </div>
      <div
        {...api().getResizeTriggerProps({ id: 'a:b' })}
        class="splitter-resize-trigger"
      >
        <div class="splitter-resize-handle" />
        <div class="splitter-resize-area" />
      </div>
      <div
        {...api().getPanelProps({ id: 'b' })}
        class="splitter-panel-b"
      >
        <div class="splitter-panel-content">
          <p class="splitter-panel-text">Two</p>
        </div>
      </div>
    </div>
  )
}
