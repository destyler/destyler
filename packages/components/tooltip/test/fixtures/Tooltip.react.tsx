import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'

const Tooltip: FC = () => {
  const [state, send] = useMachine(tooltip.machine({
    id: useId(),
  }))

  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Tooltip Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Tooltip
