import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as steps from '@destyler/steps'
import { useId } from 'react'

const Steps: FC = () => {
  const [state, send] = useMachine(steps.machine({
    id: useId(),
  }))

  const api = steps.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Steps Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Steps
