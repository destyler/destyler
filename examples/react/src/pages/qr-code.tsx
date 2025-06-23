import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/react'
import { qrCodeControls } from '@destyler/shared-private-private'
import * as React from 'react'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'

import { useControls } from '../hooks/use-controls'

export default function QrCode() {
  const controls = useControls(qrCodeControls)

  const [state, send] = useMachine(
    qrCode.machine({
      id: useId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = qrCode.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="w-270px h-270px">
        <svg {...api.getFrameProps()} className="w-270px h-270px">
          <path {...api.getPatternProps()} />
        </svg>
        <div {...api.getOverlayProps()} className="w-50px h-50px">
          <img
            src="https://github.com/destyler.png"
            alt=""
          />
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
