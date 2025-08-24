import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function NumberInput() {
  const [state, send] = useMachine(numberInput.machine({
    id: useId(),
    value: '66',
    allowMouseWheel: true,
  }))

  const api = numberInput.connect(state, send, normalizeProps)

  return (
    <div
      className="w-full mt-0!"
      {...api.getRootProps()}
    >
      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          {...api.getDecrementTriggerProps()}
        >
          <span className="text-lg text-primary!">-</span>
        </button>
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-primary! ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
          {...api.getInputProps()}
        />
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          {...api.getIncrementTriggerProps()}
        >
          <span className="text-lg text-primary!">+</span>
        </button>
      </div>
    </div>
  )
}
