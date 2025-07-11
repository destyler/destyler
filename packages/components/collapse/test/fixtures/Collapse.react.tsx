import type { FC } from 'react'
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Collapse: FC = () => {
  const [state, send] = useMachine(collapse.machine({
    id: useId(),
  }))

  const api = collapse.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Collapse Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Collapse
