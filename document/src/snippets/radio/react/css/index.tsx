import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Radio() {
  const items = [
    { id: 'default', label: 'Default' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'compact', label: 'Compact' },
  ]

  const [state, send] = useMachine(radio.machine({
    id: useId(),
    value: 'default',
  }))

  const api = radio.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="radio-root">
      {items.map(opt => (
        <div
          key={opt.id}
          className="radio-option"
        >
          <label
            {...api.getItemProps({ value: opt.id })}
            className="radio-label"
          >
            <div className="radio-wrapper">
              <input
                {...api.getItemHiddenInputProps({ value: opt.id })}
                className="radio-input"
              />
              <div
                {...api.getItemControlProps({ value: opt.id })}
                className="radio-control"
              />
            </div>
            <span
              {...api.getItemTextProps({ value: opt.id })}
              className="radio-text"
            >
              {opt.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
