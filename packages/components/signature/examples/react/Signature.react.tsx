import { normalizeProps, useMachine } from '@destyler/react'
import { signatureControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId, useState } from 'react'
import * as signaturePad from '../../index'
import '../style.css'

export default function Page() {
  const [url, setUrl] = useState('')

  const controls = useControls(signatureControls)

  const [state, send] = useMachine(
    signaturePad.machine({
      id: useId(),
      onDrawEnd(details) {
        details.getDataUrl('image/png').then(setUrl)
      },
      drawing: {
        fill: 'red',
        size: 4,
        simulatePressure: true,
      },
    }),
    { context: controls.context },
  )

  const api = signaturePad.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <label {...api.getLabelProps()}>Signature Pad</label>

          <div {...api.getControlProps()}>
            <svg {...api.getSegmentProps()}>
              {api.paths.map((path, i) => (
                <path key={i} {...api.getSegmentPathProps({ path })} />
              ))}
              {api.currentPath && <path {...api.getSegmentPathProps({ path: api.currentPath })} />}
            </svg>

            <div {...api.getGuideProps()} />
          </div>

          <button {...api.getClearTriggerProps()}>
            x
          </button>
        </div>

        <button
          onClick={() => {
            api.getDataUrl('image/png').then(setUrl)
          }}
        >
          Show Image
        </button>
        {url && <img data-part="preview" alt="signature" src={url} />}
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} omit={['currentPoints', 'currentPath', 'paths']} />
      </Toolbar>
    </Layout>
  )
}
