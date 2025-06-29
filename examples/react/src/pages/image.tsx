import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

export default function ImageDemo() {
  const [state, send] = useMachine(image.machine({ id: useId() }))
  const api = image.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <div {...api.getFallbackProps()} className="h-full w-full rounded-full bg-dark text-white">
          EH
        </div>
        <img
          alt="EH"
          src="https://github.com/elonehoo.png"
          {...api.getImageProps()}
          className="aspect-square h-full w-full"
        />
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
