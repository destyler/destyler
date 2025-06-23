import * as qrCode from '@destyler/qr-code'
import { qrCodeControls } from '@destyler/shared-private-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function QrCode() {
  const controls = useControls(qrCodeControls)
  const id = createUniqueId()

  const [state, send] = useMachine(
    qrCode.machine({
      id,
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => qrCode.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="w-270px h-270px">
        <svg {...api().getFrameProps()} class="w-270px h-270px">
          <path {...api().getPatternProps()} />
        </svg>
        <div {...api().getOverlayProps()} class="w-50px h-50px">
          <img
            src="https://github.com/destyler.png"
            alt=""
          />
        </div>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
