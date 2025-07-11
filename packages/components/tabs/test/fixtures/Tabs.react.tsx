import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tabs from '@destyler/tabs'
import { useId } from 'react'

const Tabs: FC = () => {
  const [state, send] = useMachine(tabs.machine({
    id: useId(),
  }))

  const api = tabs.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Tabs Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Tabs
