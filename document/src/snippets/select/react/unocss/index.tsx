import { normalizeProps, useMachine } from '@destyler/react'
import * as select from '@destyler/select'
import { useId } from 'react'
import { createPortal } from 'react-dom'

const selectData = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
]

export default function Select() {
  const [state, send] = useMachine(
    select.machine({
      id: useId(),
      collection: select.collection({
        items: selectData,
      }),
    }),
  )

  const api = select.connect(state, send, normalizeProps)

  return (
    <>
      <div className="flex flex-col outline-none!">
        <button
          {...api.getTriggerProps()}
          className="group flex h-10 w-full items-center outline-none! justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-foreground">{api.valueAsString || 'Select option'}</span>
          <span className="i-carbon:chevron-down transition-transform duration-300 group-data-[state=open]:rotate--180 w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {api.open && createPortal(
        <div
          {...api.getPositionerProps()}
          className="relative z-50! min-w-[8rem] w-[--reference-width]"
        >
          <ul
            {...api.getContentProps()}
            className="absolute w-full rounded-md border border-input! bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
          >
            {selectData.map(item => (
              <li
                key={item.value}
                {...api.getItemProps({ item })}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span>{item.label}</span>
                <span
                  {...api.getItemIndicatorProps({ item })}
                  className="ml-auto pl-2 text-primary"
                >
                  <span className="i-lucide:check w-4 h-4" />
                </span>
              </li>
            ))}
          </ul>
        </div>,
        document.body,
      )}
    </>
  )
}
