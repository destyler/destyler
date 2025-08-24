import { normalizeProps, useMachine } from '@destyler/react'
import * as switchs from '@destyler/switch'
import { useId } from 'react'

export default function Switch() {
  const [state, send] = useMachine(switchs.machine({
    id: useId(),
    checked: true,
  }))

  const api = switchs.connect(state, send, normalizeProps)

  return (
    <label
      {...api.getRootProps()}
      className="flex items-center mt-0! justify-center cursor-pointer disabled:cursor-not-allowed"
    >
      <input {...api.getHiddenInputProps()} />
      <span
        {...api.getControlProps()}
        className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      >
        <span
          {...api.getThumbProps()}
          className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        />
      </span>
    </label>
  )
}
