import type { FC } from 'react'
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Popover: FC = () => {
  const [state, send] = useMachine(popover.machine({
    id: useId(),
  }))

  const api = popover.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Popover Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Popover
