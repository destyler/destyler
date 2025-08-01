import * as menu from '@destyler/menu'
import { menuControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/menu.css'

export default function MenuDemo() {
  const controls = useControls(menuControls)

  const [state, send] = useMachine(
    menu.machine({
      'id': createUniqueId(),
      'aria-label': 'File',
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => menu.connect(state, send, normalizeProps))

  const items = [
    { value: 'edit', label: 'Edit' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'delete', label: 'Delete' },
    { value: 'export', label: 'Export...' },
  ]

  return (
    <>
      <div class="menu-root">
        <button
          {...api().getTriggerProps()}
          class="menu-trigger"
        >
          Actions
          <span
            {...api().getIndicatorProps()}
            class="menu-indicator"
          >
            ▾
          </span>
        </button>
        <div
          {...api().getPositionerProps()}
          class="menu-positioner"
        >
          <ul
            {...api().getContentProps()}
            class="menu-content"
          >
            {items.map(item => (
              <li
                {...api().getItemProps({ value: item.value })}
                class="menu-item"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
