import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

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
    <div {...api.getRootProps()}>
      {items.map(opt => (
        <div
          key={opt.id}
          className="flex items-center space-x-3 mt-0!"
        >
          <label {...api.getItemProps({ value: opt.id })}>
            <div className="relative mt-0!">
              <input {...api.getItemHiddenInputProps({ value: opt.id })} />
              <div {...api.getItemControlProps({ value: opt.id })} />
            </div>
            <span {...api.getItemTextProps({ value: opt.id })}>
              {opt.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
