/** @jsxImportSource solid-js */

import { qrCodeControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as qrCode from '../../index'

export default function Page() {
  const controls = useControls(qrCodeControls)

  const [state, send] = useMachine(
    qrCode.machine({
      id: createUniqueId(),
      encoding: { ecc: 'H' },
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => qrCode.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <svg {...api().getFrameProps()}>
            <path {...api().getPatternProps()} />
          </svg>
          <div {...api().getOverlayProps()}>
            <img src="https://avatars.githubusercontent.com/u/143371546?s=88&v=4" alt="" />
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
