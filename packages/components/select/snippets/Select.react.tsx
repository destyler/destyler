import { normalizeProps, useMachine } from '@destyler/react'
import * as select from '@destyler/select'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import './style.css'

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
      <div className="flex flex-col outline-none! mt-0!">
        <button {...api.getTriggerProps()}>
          <span>{api.valueAsString || 'Select option'}</span>
          <span />
        </button>
      </div>

      {api.open && createPortal(
        <div data-layout="sinppets" {...api.getPositionerProps()}>
          <ul {...api.getContentProps()}>
            {selectData.map(item => (
              <li key={item.value} {...api.getItemProps({ item })}>
                <span>{item.label}</span>
                <span {...api.getItemIndicatorProps({ item })}>
                  <span />
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
