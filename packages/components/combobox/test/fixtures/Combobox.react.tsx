import type { FC } from 'react'
import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Combobox: FC = () => {
  const [state, send] = useMachine(combobox.machine({
    id: useId(),
  }))

  const api = combobox.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Combobox Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Combobox
