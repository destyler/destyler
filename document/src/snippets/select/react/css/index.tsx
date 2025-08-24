import { normalizeProps, useMachine } from '@destyler/react'
import * as select from '@destyler/select'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import './index.css'

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
      <div className="select-container">
        <button
          {...api.getTriggerProps()}
          className="select-trigger"
        >
          <span className="select-value">{api.valueAsString || 'Select option'}</span>
          <span className="select-icon" />
        </button>
      </div>

      {api.open && createPortal(
        <div
          {...api.getPositionerProps()}
          className="select-dropdown-positioner"
        >
          <ul
            {...api.getContentProps()}
            className="select-dropdown"
          >
            {selectData.map(item => (
              <li
                key={item.value}
                {...api.getItemProps({ item })}
                className="select-option"
              >
                <span>{item.label}</span>
                <span
                  {...api.getItemIndicatorProps({ item })}
                  className="select-indicator"
                >
                  <span className="select-check" />
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
