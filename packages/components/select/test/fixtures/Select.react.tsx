import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import * as select from '@destyler/select'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Select: FC = () => {
  const [state, send] = useMachine(select.machine({
    id: useId(),
  }))

  const api = select.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Select Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Select
