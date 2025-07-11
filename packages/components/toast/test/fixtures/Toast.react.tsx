import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as toast from '@destyler/toast'
import { useId } from 'react'

const Toast: FC = () => {
  const [state, send] = useMachine(toast.machine({
    id: useId(),
  }))

  const api = toast.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Toast Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Toast
