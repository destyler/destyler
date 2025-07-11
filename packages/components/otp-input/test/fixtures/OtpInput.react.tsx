import type { FC } from 'react'
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const OtpInput: FC = () => {
  const [state, send] = useMachine(otpInput.machine({
    id: useId(),
  }))

  const api = otpInput.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        OtpInput Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default OtpInput
