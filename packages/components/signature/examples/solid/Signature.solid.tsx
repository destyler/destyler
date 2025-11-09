/** @jsxImportSource solid-js */

import { signatureControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js'
import * as signaturePad from '../../index'
import '../style.css'

export default function Page() {
  const [url, setUrl] = createSignal('')

  const controls = useControls(signatureControls)

  const [state, send] = useMachine(
    signaturePad.machine({
      id: createUniqueId(),
      onDrawEnd(details) {
        details.getDataUrl('image/png').then(setUrl)
      },
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => signaturePad.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <label {...api().getLabelProps()}>Signature Pad</label>

          <div {...api().getControlProps()}>
            <svg {...api().getSegmentProps()}>
              <For each={api().paths}>{path => <path {...api().getSegmentPathProps({ path })} />}</For>
              <Show when={api().currentPath}>
                {path => <path {...api().getSegmentPathProps({ path: path() })} />}
              </Show>
            </svg>
            <div {...api().getGuideProps()} />
          </div>

          <button {...api().getClearTriggerProps()}>
            x
          </button>
        </div>

        <button
          onClick={() => {
            api().getDataUrl('image/png').then(setUrl)
          }}
        >
          Show Image
        </button>

        <Show when={url()}>
          <img data-part="preview" alt="signature" src={url()} />
        </Show>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['currentPoints', 'currentPath', 'paths']} />
      </Toolbar>
    </Layout>
  )
}
