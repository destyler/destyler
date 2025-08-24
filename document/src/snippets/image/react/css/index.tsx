import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function Image() {
  const [state, send] = useMachine(image.machine({
    id: useId(),
  }))

  const api = image.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="root">
      <img
        alt="EH"
        src="https://github.com/destyler.png"
        {...api.getImageProps()}
        className="image"
      />
      <div
        {...api.getFallbackProps()}
        className="fallback"
      >
        EH
      </div>
    </div>
  )
}
