/** @jsxImportSource solid-js */
import * as select from '@destyler/select'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import '../../styles/components/select.css'

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
      <div class="flex flex-col outline-none! mt-0!">
        <button {...api().getTriggerProps()}>
          <span>{api().valueAsString || 'Select option'}</span>
          <span />
        </button>
      </div>

      {api().open && (
        <Portal mount={document.body}>
          <div data-layout="sinppets" {...api().getPositionerProps()}>
            <ul {...api().getContentProps()}>
              {selectData.map(item => (
                <li {...api().getItemProps({ item })}>
                  <span>{item.label}</span>
                  <span {...api().getItemIndicatorProps({ item })}>
                    <span />
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
