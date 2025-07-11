import type { FC } from 'react'
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Dialog: FC = () => {
  const [state, send] = useMachine(dialog.machine({
    id: useId(),
  }))

  const api = dialog.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Dialog Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Dialog
