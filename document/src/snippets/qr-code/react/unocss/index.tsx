/** @jsxImportSource react */
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function QrCode() {
  const [state, send] = useMachine(
    qrCode.machine({
      id: useId(),
      value: 'https://destyler.org',
      encoding: {
        ecc: 'H',
      },
    }),
  )
  
  const api = qrCode.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="size-135px">
      <svg {...api.getFrameProps()} className="size-135px bg-background">
        <path {...api.getPatternProps()} className="fill-primary" />
      </svg>
    </div>
  )
}
