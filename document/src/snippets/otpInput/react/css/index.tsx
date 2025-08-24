import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useMemo } from 'react'
import './index.css'

export default function OtpInput() {
  const [state, send] = useMachine(otpInput.machine({
    id: useId(),
    otp: true,
    placeholder: '',
  }))

  const api = useMemo(() => otpInput.connect(state, send, normalizeProps), [state, send])

  return (
    <div className="otp-container">
      <div className="otp-inner-container">
        <div className="otp-input-group">
          <div
            {...api.getRootProps()}
            className="otp-root"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                {...api.getInputProps({ index })}
                className="otp-input"
              />
            ))}
          </div>
        </div>

        <div className="otp-button-container">
          <button
            className="otp-clear-button"
            onClick={api.clearValue}
          >
            <span>clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}
