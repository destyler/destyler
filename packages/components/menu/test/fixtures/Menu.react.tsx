import type { FC } from 'react'
import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const Menu: FC = () => {
  const [state, send] = useMachine(menu.machine({
    id: useId(),
  }))

  const api = menu.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        Menu Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Menu
