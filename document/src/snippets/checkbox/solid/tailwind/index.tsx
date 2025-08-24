/** @jsxImportSource solid-js */
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Checkbox() {
  const [state, send] = useMachine(checkbox.machine({
    name: 'checkbox',
    id: createUniqueId(),
  }))
  const api = createMemo(() => checkbox.connect(state, send, normalizeProps))

  return (
    <label {...api().getRootProps()} class="flex items-center gap-2 cursor-pointer">
      <div
        {...api().getControlProps()}
        class={
          `peer h-4 w-4 shrink-0 rounded-sm border border-primary
          shadow-sm focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
          flex items-center justify-center`
        }
      >
        {api().checked && <div class="i-carbon-checkmark w-3 h-3" />}
      </div>
      <span {...api().getLabelProps()} class="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Input is
        {' '}
        {api().checked ? ' checked' : ' unchecked'}
      </span>

      <input {...api().getHiddenInputProps()} />
    </label>
  )
}
