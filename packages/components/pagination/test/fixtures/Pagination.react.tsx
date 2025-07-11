import type { FC } from 'react'
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Pagination: FC = () => {
  const [state, send] = useMachine(pagination.machine({
    id: useId(),
  }))

  const api = pagination.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Pagination Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Pagination
