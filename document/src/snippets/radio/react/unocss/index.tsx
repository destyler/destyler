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
    <div {...api.getRootProps()} className="grid gap-2">
      {items.map(opt => (
        <div
          key={opt.id}
          className="flex items-center space-x-3"
        >
          <label
            {...api.getItemProps({ value: opt.id })}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="relative">
              <input
                {...api.getItemHiddenInputProps({ value: opt.id })}
                className="peer sr-only"
              />
              <div
                {...api.getItemControlProps({ value: opt.id })}
                className="h-4 w-4 rounded-full border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
            </div>
            <span
              {...api.getItemTextProps({ value: opt.id })}
              className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {opt.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
