import { normalizeProps, useMachine } from '@destyler/react'
import * as select from '@destyler/select'
import { selectControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'

export default function Select() {
  const controls = useControls(selectControls)

  const selectData = [
    { label: 'Nigeria', value: 'NG' },
    { label: 'Japan', value: 'JP' },
    // ...
  ]

  const [state, send] = useMachine(
    select.machine({
      id: useId(),
      collection: select.collection({
        items: selectData,
      }),
    }),
    {
      context: controls.context,
    },
  )

  const api = select.connect(state, send, normalizeProps)

  return (
    <div className="flex flex-col space-y-2 p-4">
      <label
        {...api.getLabelProps()}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Label
      </label>
      <button
        {...api.getTriggerProps()}
        className="group flex items-center justify-between w-xs px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <span>{api.valueAsString || 'Select option'}</span>
        <span className="transition-transform duration-300 i-carbon:chevron-right w-4 h-4 text-gray-400 group-data-[state=open]:rotate-90" />
      </button>

      <div
        {...api.getPositionerProps()}
        className="relative z-50 w-[--reference-width]"
      >
        <ul
          {...api.getContentProps()}
          className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        >
          {selectData.map(item => (
            <li
              key={item.value}
              {...api.getItemProps({ item })}
              className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              <span>{item.label}</span>
              <span
                {...api.getItemIndicatorProps({ item })}
                className="text-gray-600 dark:text-gray-400"
              >
                ✓
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
