import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { menuControls } from '@destyler/shared'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

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
      <div className="p-4">
        <button
          {...api.getTriggerProps()}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Actions
          <span
            {...api.getIndicatorProps()}
            className="ml-2"
          >
            ▾

          </span>
        </button>
        <div
          {...api.getPositionerProps()}
          className="relative"
        >
          <ul
            {...api.getContentProps()}
            className="absolute mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-200 py-1"
          >
            {items.map(item => (
              <li
                key={item.value}
                {...api.getItemProps({ value: item.value })}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
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
