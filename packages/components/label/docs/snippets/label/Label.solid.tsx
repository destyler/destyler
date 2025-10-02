/** @jsxImportSource solid-js */
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@docs/styles/components/label.css'

export default function Label() {
  const id = createUniqueId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = createMemo(() => label.connect(state, send, normalizeProps))

  return (
    <>
      <div class="flex flex-wrap items-center gap-[15px] px-5">
        <label {...api().getRootProps()}>
          First name
        </label>
        <input
          id="firstName"
          class={`bg-input border inline-flex h-[35px] w-[200px]
          appearance-none items-center justify-center rounded-lg
          px-[10px] text-sm leading-none shadow-sm outline-none
          focus:shadow-[0_0_0_2px_black] text-foreground
          selection:color-primary selection:bg-background`}
          type="text"
          value="Elone Hoo"
        />
      </div>
    </>
  )
}
