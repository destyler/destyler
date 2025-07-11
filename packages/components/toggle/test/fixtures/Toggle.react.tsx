import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as toggle from '@destyler/toggle'
import { useId } from 'react'

const Toggle: FC = () => {
  const [state, send] = useMachine(toggle.machine({
    id: useId(),
  }))

  const api = toggle.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Toggle Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Toggle
