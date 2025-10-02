/** @jsxImportSource solid-js */
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@docs/styles/components/aspect-radio.css'

function AspectRatio() {
  const [state, send] = useMachine(aspectRatio.machine({
    id: createUniqueId(),
    ratio: 16 / 9,
  }))
  const api = createMemo(() => aspectRatio.connect(state, send, normalizeProps))
  return (
    <>
      <div {...api().getRootProps()}>
        <div {...api().getContentProps()}>
          <img
            src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
          />
        </div>
      </div>
    </>
  )
}

export default AspectRatio
