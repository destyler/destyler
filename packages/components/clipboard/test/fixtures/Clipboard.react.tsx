import type { FC } from 'react'
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Clipboard: FC = () => {
  const [state, send] = useMachine(clipboard.machine({
    id: useId(),
  }))

  const api = clipboard.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Clipboard Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Clipboard
