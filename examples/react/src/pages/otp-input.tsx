import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { pinInputControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId, useMemo } from 'react'
import '@destyler/shared-private/styles/otp-input.css'

export default function OtpInput() {
  const controls = useControls(pinInputControls)
  const [state, send] = useMachine(otpInput.machine({ id: useId() }), {
    context: controls.context,
  })
  const api = useMemo(() => otpInput.connect(state, send, normalizeProps), [state, send])

  return (
    <>
      <input data-testid="copy-text" />
      <div className="otp-input-box">
        <div className="otp-input-content-box">
          <div>
            <h2>
              Verification Code
            </h2>
            <p>
              Please enter the 3-digit code you received
            </p>
          </div>
          <div
            {...api.getRootProps()}
            className="otp-input-root"
          >
            {[1, 2, 3].map(index => (
              <input
                key={index}
                data-testid={`input-${index}`}
                {...api.getInputProps({ index: index - 1 })}
                className="otp-input-item-input"
              />
            ))}
          </div>
          <div>
            <button
              data-testid="clear"
              onClick={api.clearValue}
            >
              Clear
            </button>
            <button
              data-testid="focus"
              onClick={api.focus}
            >
              Focus
            </button>
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
