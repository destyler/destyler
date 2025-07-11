import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as splitter from '@destyler/splitter'
import { useId } from 'react'

const Splitter: FC = () => {
  const [state, send] = useMachine(splitter.machine({
    id: useId(),
  }))

  const api = splitter.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Splitter Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Splitter
