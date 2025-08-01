import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared/src/styles/components/image.css'

export default function ImageDemo() {
  const [state, send] = useMachine(image.machine({ id: useId() }))
  const api = image.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="image-root">
        <div {...api.getFallbackProps()} className="image-fallback">
          EH
        </div>
        <img
          alt="EH"
          src="https://github.com/elonehoo.png"
          {...api.getImageProps()}
          className="image-img"
        />
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
