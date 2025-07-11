import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as signature from '@destyler/signature'
import { useId } from 'react'

const Signature: FC = () => {
  const [state, send] = useMachine(signature.machine({
    id: useId(),
  }))

  const api = signature.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Signature Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Signature
