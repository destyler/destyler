/** @jsxImportSource solid-js */
import * as otpInput from '@destyler/otp-input'
import { pinInputControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/otp-input.css'

export default function OtpInput() {
  const controls = useControls(pinInputControls)
  const uniqueId = createUniqueId()
  const [state, send] = useMachine(otpInput.machine({ id: uniqueId }), {
    context: controls.context,
  })
  const api = createMemo(() => otpInput.connect(state, send, normalizeProps))

  return (
    <>
      <input data-testid="copy-text" />
      <div class="otp-input-box">
        <div class="otp-input-content-box">
          <div>
            <h2>
              Verification Code
            </h2>
            <p>
              Please enter the 3-digit code you received
            </p>
          </div>
          <div
            {...api().getRootProps()}
            class="otp-input-root"
          >
            {[1, 2, 3].map(index => (
              <input
                data-testid={`input-${index}`}
                {...api().getInputProps({ index: index - 1 })}
                class="otp-input-item-input"
              />
            ))}
          </div>
          <div>
            <button
              data-testid="clear"
              onClick={() => api().clearValue()}
            >
              Clear
            </button>
            <button
              data-testid="focus"
              onClick={() => api().focus()}
            >
              Focus
            </button>
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
