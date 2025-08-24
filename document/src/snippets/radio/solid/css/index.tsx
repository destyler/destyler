/** @jsxImportSource solid-js */
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Radio() {
  const items = [
    { id: 'default', label: 'Default' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'compact', label: 'Compact' },
  ]

  const [state, send] = useMachine(radio.machine({
    id: createUniqueId(),
    value: 'default',
  }))

  const api = createMemo(() => radio.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="radio-root">
      {items.map(opt => (
        <div
          class="radio-option"
        >
          <label
            {...api().getItemProps({ value: opt.id })}
            class="radio-label"
          >
            <div class="radio-wrapper">
              <input
                {...api().getItemHiddenInputProps({ value: opt.id })}
                class="radio-input"
              />
              <div
                {...api().getItemControlProps({ value: opt.id })}
                class="radio-control"
              />
            </div>
            <span
              {...api().getItemTextProps({ value: opt.id })}
              class="radio-text"
            >
              {opt.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
