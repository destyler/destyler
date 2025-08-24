/** @jsxImportSource solid-js */
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

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
    <div {...api().getRootProps()} class="size-135px">
      <svg {...api().getFrameProps()} class="size-135px bg-background">
        <path {...api().getPatternProps()} class="fill-primary" />
      </svg>
    </div>
  )
}
