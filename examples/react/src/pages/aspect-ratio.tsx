import type { FC } from 'react'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

const AspectRatio: FC = () => {
  const [state, send] = useMachine(aspectRatio.machine({
    id: useId(),
  }))

  const api = aspectRatio.connect(state, send, normalizeProps)

  return (
    <div className="w-full sm:w-75 overflow-hidden rounded-md">
      <div {...api.getRootProps()}>
        <div {...api.getContentProps()}>
          <img
            className="h-full w-full object-cover"
            src="https://elonehoo.me/gallery/20_sun.jpg"
          />
        </div>
      </div>
    </div>
  )
}

export default AspectRatio
