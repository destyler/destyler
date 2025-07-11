import type { FC } from 'react'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Breadcrumbs: FC = () => {
  const [state, send] = useMachine(breadcrumbs.machine({
    id: useId(),
  }))

  const api = breadcrumbs.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Breadcrumbs Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Breadcrumbs
