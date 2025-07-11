import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import * as separator from '@destyler/separator'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Separator: FC = () => {
  const [state, send] = useMachine(separator.machine({
    id: useId(),
    orientation: 'horizontal',
  }))

  const [verticalState, verticalSend] = useMachine(separator.machine({
    id: useId(),
    orientation: 'vertical',
  }))

  const api = separator.connect(state, send, normalizeProps)
  const verticalApi = separator.connect(verticalState, verticalSend, normalizeProps)

  return (
    <>
      <div>
        <div {...api.getRootProps()} style={{ height: '1px', background: '#e1e5e9', margin: '15px 0' }} />
        <div
          {...verticalApi.getRootProps()}
          data-testid="vertical-separator"
          style={{ width: '1px', height: '100px', background: '#e1e5e9', margin: '15px' }}
        />
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Separator
