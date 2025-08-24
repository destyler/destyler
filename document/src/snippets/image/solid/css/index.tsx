/** @jsxImportSource solid-js */
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Image() {
  const [state, send] = useMachine(image.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => image.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="root">
      <img
        alt="EH"
        src="https://github.com/destyler.png"
        {...api().getImageProps()}
        class="image"
      />
      <div
        {...api().getFallbackProps()}
        class="fallback"
      >
        EH
      </div>
    </div>
  )
}
