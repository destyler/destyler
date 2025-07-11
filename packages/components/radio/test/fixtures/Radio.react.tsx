import type { FC } from 'react'
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Radio: FC = () => {
  const [state, send] = useMachine(radio.machine({
    id: useId(),
  }))

  const api = radio.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Radio Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Radio
