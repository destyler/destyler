import type { FC } from 'react'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

const AspectRatio: FC = () => {

  const [state, send] = useMachine(aspectRatio.machine({
    id: useId(),
    ratio: 16 / 9,
  }))

  const api = aspectRatio.connect(state, send, normalizeProps)

  return (
    <>
      <div className="aspect-ratio-wrapper">
        <div {...api.getRootProps()}>
          <div {...api.getContentProps()}>
            <img
              className="aspect-ratio-image"
              src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AspectRatio
