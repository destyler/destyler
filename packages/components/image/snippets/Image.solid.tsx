/** @jsxImportSource solid-js */
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function Image() {
  const [state, send] = useMachine(image.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => image.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <img
        alt="Destyler UI"
        src="https://github.com/destyler.png"
        {...api().getImageProps()}
      />
      <div {...api().getFallbackProps()}>
        EH
      </div>
    </div>
  )
}
