/** @jsxImportSource solid-js */
import * as select from '@destyler/select'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
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
      id: createUniqueId(),
      collection: select.collection({
        items: selectData,
      }),
    }),
  )

  const api = createMemo(() => select.connect(state, send, normalizeProps))

  return (
    <>
      <div class="select-container">
        <button
          {...api().getTriggerProps()}
          class="select-trigger"
        >
          <span class="select-value">{api().valueAsString || 'Select option'}</span>
          <span class="select-icon" />
        </button>
      </div>

      {api().open && (
        <Portal mount={document.body}>
          <div
            {...api().getPositionerProps()}
            class="select-dropdown-positioner"
          >
            <ul
              {...api().getContentProps()}
              class="select-dropdown"
            >
              {selectData.map(item => (
                <li
                  {...api().getItemProps({ item })}
                  class="select-option"
                >
                  <span>{item.label}</span>
                  <span
                    {...api().getItemIndicatorProps({ item })}
                    class="select-indicator"
                  >
                    <span class="select-check" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Portal>
      )}
    </>
  )
}
