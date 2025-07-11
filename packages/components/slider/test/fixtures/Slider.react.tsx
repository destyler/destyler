import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as slider from '@destyler/slider'
import { useId } from 'react'

const Slider: FC = () => {
  const [state, send] = useMachine(slider.machine({
    id: useId(),
  }))

  const api = slider.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Slider Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Slider
