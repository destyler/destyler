import type { FC } from 'react'
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const QrCode: FC = () => {
  const [state, send] = useMachine(qrCode.machine({
    id: useId(),
  }))

  const api = qrCode.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        QrCode Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default QrCode
