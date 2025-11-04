import { normalizeProps, useMachine } from '@destyler/react'
import { qrCodeControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as qrCode from '../../index'
import '../style.css'

export default function Page() {
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
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <svg {...api.getFrameProps()}>
            <path {...api.getPatternProps()} />
          </svg>
          <div {...api.getOverlayProps()}>
            <img src="https://avatars.githubusercontent.com/u/143371546?s=88&v=4" alt="" />
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} omit={['encoded']} />
      </Toolbar>
    </Layout>
  )
}
