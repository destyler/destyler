import type { FC } from 'react'
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Label: FC = () => {
  const [state, send] = useMachine(label.machine({
    id: useId(),
  }))

  const api = label.connect(state, send, normalizeProps)

  return (
    <>
      <label {...api.getRootProps()}>
        Test Label
      </label>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Label
