import type { FC } from 'react'
import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Presence: FC = () => {
  const [state, send] = useMachine(presence.machine({
    id: useId(),
  }))

  const api = presence.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Presence Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Presence
