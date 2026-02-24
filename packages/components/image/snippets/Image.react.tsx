import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function Image() {
  const [state, send] = useMachine(image.machine({
    id: useId(),
  }))

  const api = image.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <img
        alt="Destyler"
        src="https://github.com/destyler.png"
        {...api.getImageProps()}
      />
      <div {...api.getFallbackProps()}>
        EH
      </div>
    </div>
  )
}
