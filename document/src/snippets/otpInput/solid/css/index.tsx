/** @jsxImportSource solid-js */
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function OtpInput() {
  const uniqueId = createUniqueId()

  const [state, send] = useMachine(otpInput.machine({
    id: uniqueId,
    otp: true,
    placeholder: '',
  }))

  const api = createMemo(() => otpInput.connect(state, send, normalizeProps))

  return (
    <div class="otp-container">
      <div class="otp-inner-container">
        <div class="otp-input-group">
          <div
            {...api().getRootProps()}
            class="otp-root"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <input
                {...api().getInputProps({ index })}
                class="otp-input"
              />
            ))}
          </div>
        </div>

        <div class="otp-button-container">
          <button
            class="otp-clear-button"
            onClick={() => api().clearValue()}
          >
            <span>clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}
