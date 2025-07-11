import type { FC } from 'react'
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const FloatingPanel: FC = () => {
  const [state, send] = useMachine(floatingPanel.machine({
    id: useId(),
  }))

  const api = floatingPanel.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        FloatingPanel Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default FloatingPanel
