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
    <div {...api().getRootProps()} class="grid gap-2 mt-0!">
      {items.map(opt => (
        <div
          class="flex items-center space-x-3 mt-0!"
        >
          <label
            {...api().getItemProps({ value: opt.id })}
            class="flex items-center space-x-2 cursor-pointer"
          >
            <div class="relative mt-0!">
              <input
                {...api().getItemHiddenInputProps({ value: opt.id })}
                class="peer sr-only"
              />
              <div
                {...api().getItemControlProps({ value: opt.id })}
                class="mt-0! h-4 w-4 rounded-full border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
            </div>
            <span
              {...api().getItemTextProps({ value: opt.id })}
              class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {opt.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
