import type { FC } from 'react'
import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Calendar: FC = () => {
  const [state, send] = useMachine(calendar.machine({
    id: useId(),
  }))

  const api = calendar.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Calendar Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Calendar
