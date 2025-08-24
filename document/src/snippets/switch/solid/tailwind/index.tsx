/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as switchs from '@destyler/switch'
import { createMemo, createUniqueId } from 'solid-js'

export default function Switch() {
  const [state, send] = useMachine(switchs.machine({
    id: createUniqueId(),
    checked: true,
  }))

  const api = createMemo(() => switchs.connect(state, send, normalizeProps))

  return (
    <label
      {...api().getRootProps()}
      class="flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
    >
      <input {...api().getHiddenInputProps()} />
      <span
        {...api().getControlProps()}
        class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      >
        <span
          {...api().getThumbProps()}
          class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        />
      </span>
    </label>
  )
}
