/** @jsxImportSource solid-js */
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function OtpInput() {
  const uniqueId = createUniqueId()

  const [state, send] = useMachine(otpInput.machine({
    id: uniqueId,
    otp: true,
    placeholder: '',
  }))

  const api = createMemo(() => otpInput.connect(state, send, normalizeProps))

  return (
    <div class="flex flex-col items-center justify-center w-full">
      <div class="w-full max-w-sm space-y-6">
        <div class="flex items-center gap-2 has-[:disabled]:opacity-50">
          <div
            {...api().getRootProps()}
            class="flex items-center"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <input
                {...api().getInputProps({ index })}
                class={`relative flex h-9 w-9 items-center justify-center text-primary text-center
                border-y border-r border-primary/20 text-sm shadow-sm bg-transparent!
                transition-all first:rounded-l-md first:border-l last:rounded-r-md`}
              />
            ))}
          </div>
        </div>

        <div class="flex justify-start">
          <button
            class={`focus:outline-none disabled:cursor-not-allowed
            disabled:opacity-75 flex-shrink-0 font-medium rounded-md
            text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm
            text-primary-foreground! bg-primary!
            hover:bg-primary/90! focus-visible:outline
            focus-visible:outline-offset-2 focus-visible:outline-light-500
            dark:focus-visible:outline-light-400 inline-flex items-center`}
            onClick={() => api().clearValue()}
          >
            <span>clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}
