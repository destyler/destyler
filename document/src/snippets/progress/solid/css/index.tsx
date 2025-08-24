/** @jsxImportSource solid-js */
import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Progress() {
  const [state, send] = useMachine(progress.machine({
    id: createUniqueId(),
    value: 30,
  }))

  const api = createMemo(() => progress.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="progress-root">
      <div
        {...api().getTrackProps()}
        class="progress-track"
      >
        <div
          {...api().getRangeProps()}
          class="progress-range"
        />
      </div>
    </div>
  )
}
