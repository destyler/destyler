/** @jsxImportSource react */
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

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
    <div {...api.getRootProps()} className="qr-root">
      <svg {...api.getFrameProps()} className="qr-frame">
        <path {...api.getPatternProps()} className="qr-pattern" />
      </svg>
    </div>
  )
}
