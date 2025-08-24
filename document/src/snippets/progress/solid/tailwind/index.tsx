/** @jsxImportSource solid-js */
import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Progress() {
  const [state, send] = useMachine(progress.machine({
    id: createUniqueId(),
    value: 30,
  }))

  const api = createMemo(() => progress.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="w-full">
      <div
        {...api().getTrackProps()}
        class="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          {...api().getRangeProps()}
          class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-out"
        />
      </div>
    </div>
  )
}
