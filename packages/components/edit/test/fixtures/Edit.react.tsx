import type { FC } from 'react'
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Edit: FC = () => {
  const [state, send] = useMachine(edit.machine({
    id: useId(),
  }))

  const api = edit.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Edit Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Edit
