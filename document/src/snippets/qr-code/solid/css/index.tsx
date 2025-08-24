/** @jsxImportSource solid-js */
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function QrCode() {
  const [state, send] = useMachine(
    qrCode.machine({
      id: createUniqueId(),
      value: 'https://destyler.org',
      encoding: {
        ecc: 'H',
      },
    }),
  )
  
  const api = createMemo(() => qrCode.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="qr-root">
      <svg {...api().getFrameProps()} class="qr-frame">
        <path {...api().getPatternProps()} class="qr-pattern" />
      </svg>
    </div>
  )
}
