import type { FC } from 'react'
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const HoverCard: FC = () => {
  const [state, send] = useMachine(hoverCard.machine({
    id: useId(),
  }))

  const api = hoverCard.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        HoverCard Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default HoverCard
