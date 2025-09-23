import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useMemo } from 'react'
import '../../styles/components/otp-input.css'

export default function OtpInput() {
  const [state, send] = useMachine(otpInput.machine({
    id: useId(),
    otp: true,
    placeholder: '',
  }))

  const api = useMemo(() => otpInput.connect(state, send, normalizeProps), [state, send])

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-2 has-[:disabled]:opacity-50">
          <div {...api.getRootProps()}>
            {Array.from({ length: 5 }).map((_, index) => (
              <input
                key={index}
                {...api.getInputProps({ index })}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-start">
          <button
            className="focus:outline-none disabled:cursor-not-allowed
            disabled:opacity-75 flex-shrink-0 font-medium rounded-md
            text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm
            text-primary-foreground! bg-primary!
            hover:bg-primary/90! focus-visible:outline
            focus-visible:outline-offset-2 focus-visible:outline-light-500
            dark:focus-visible:outline-light-400 inline-flex items-center"
            onClick={api.clearValue}
          >
            <span>clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}
