import type { FC } from 'react'
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Dynamic: FC = () => {
  const [state, send] = useMachine(dynamic.machine({
    id: useId(),
  }))

  const api = dynamic.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Dynamic Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Dynamic
