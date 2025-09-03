import type { FC } from 'react'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '../../styles/components/aspect-radio.css'

const AspectRatio: FC = () => {
  const [state, send] = useMachine(aspectRatio.machine({
    id: useId(),
    ratio: 16 / 9,
  }))

  const api = aspectRatio.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        <div {...api.getContentProps()}>
          <img
            src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
          />
        </div>
      </div>
    </>
  )
}

export default AspectRatio
