import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Image() {
  const [state, send] = useMachine(image.machine({
    id: useId(),
  }))

  const api = image.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="relative mt-0! flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <img
        alt="EH"
        src="https://github.com/destyler.png"
        {...api.getImageProps()}
        className="aspect-square h-full w-full"
      />
      <div
        {...api.getFallbackProps()}
        className="flex h-full w-full items-center justify-center rounded-full bg-muted"
      >
        EH
      </div>
    </div>
  )
}
