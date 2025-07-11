import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as timer from '@destyler/timer'
import { useId } from 'react'

const Timer: FC = () => {
  const [state, send] = useMachine(timer.machine({
    id: useId(),
  }))

  const api = timer.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Timer Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Timer
