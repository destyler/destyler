import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Checkbox() {
  const [state, send] = useMachine(checkbox.machine({ id: useId() }))
  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <label {...api.getRootProps()} className="flex items-center gap-2 cursor-pointer mt-0!">
      <div
        {...api.getControlProps()}
        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary
          shadow-sm focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
          flex items-center justify-center"
      >
        {api.checked && <div className="i-carbon:checkmark w-3 h-3" />}
      </div>
      <span {...api.getLabelProps()} className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Input is
        {' '}
        {api.checked ? ' checked' : ' unchecked'}
      </span>

      <input {...api.getHiddenInputProps()} />
    </label>
  )
}
