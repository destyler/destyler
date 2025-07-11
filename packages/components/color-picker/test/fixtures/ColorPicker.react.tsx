import type { FC } from 'react'
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const ColorPicker: FC = () => {
  const [state, send] = useMachine(colorPicker.machine({
    id: useId(),
  }))

  const api = colorPicker.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        ColorPicker Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default ColorPicker
