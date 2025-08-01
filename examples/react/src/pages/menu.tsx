import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { menuControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/menu.css'

export default function MenuDemo() {
  const controls = useControls(menuControls)

  const [state, send] = useMachine(
    menu.machine({
      'id': useId(),
      'aria-label': 'File',
    }),
    {
      context: controls.context,
    },
  )

  const api = menu.connect(state, send, normalizeProps)

  const items = [
    { value: 'edit', label: 'Edit' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'delete', label: 'Delete' },
    { value: 'export', label: 'Export...' },
  ]

  return (
    <>
      <div className="menu-root">
        <button
          {...api.getTriggerProps()}
          className="menu-trigger"
        >
          Actions
          <span
            {...api.getIndicatorProps()}
            className="menu-indicator"
          >
            ▾

          </span>
        </button>
        <div
          {...api.getPositionerProps()}
          className="menu-positioner"
        >
          <ul
            {...api.getContentProps()}
            className="menu-content"
          >
            {items.map(item => (
              <li
                key={item.value}
                {...api.getItemProps({ value: item.value })}
                className="menu-item"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
