import type { FC } from 'react'
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Image: FC = () => {
  const [state, send] = useMachine(image.machine({
    id: useId(),
  }))

  const api = image.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Image Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Image
