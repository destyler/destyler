/** @jsxImportSource solid-js */
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

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
    <div {...api().getRootProps()}>
      <svg {...api().getFrameProps()}>
        <path {...api().getPatternProps()} />
      </svg>
    </div>
  )
}
