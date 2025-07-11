import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tour from '@destyler/tour'
import { useId } from 'react'

const Tour: FC = () => {
  const [state, send] = useMachine(tour.machine({
    id: useId(),
  }))

  const api = tour.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Tour Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Tour
