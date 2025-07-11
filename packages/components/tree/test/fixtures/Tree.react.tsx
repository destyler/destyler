import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tree from '@destyler/tree'
import { useId } from 'react'

const Tree: FC = () => {
  const [state, send] = useMachine(tree.machine({
    id: useId(),
  }))

  const api = tree.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Tree Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Tree
