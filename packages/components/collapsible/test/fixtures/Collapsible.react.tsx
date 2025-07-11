import type { FC } from 'react'
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Collapsible: FC = () => {
  const [state, send] = useMachine(collapsible.machine({
    id: useId(),
  }))

  const api = collapsible.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Collapsible Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Collapsible
