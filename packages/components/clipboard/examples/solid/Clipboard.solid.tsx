/** @jsxImportSource solid-js */
import { clipboardControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as clipboard from '../../index'
import '../style.css'

export default function Clipboard() {
  const controls = useControls(clipboardControls)

  const [state, send] = useMachine(clipboard.machine({
    id: createUniqueId(),
    value: 'https://destyler.org',
  }), {
    context: controls.context,
  })

  const api = createMemo(() => clipboard.connect(state, send, normalizeProps))
  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <label {...api().getLabelProps()}>Copy this link</label>
          <div {...api().getControlProps()}>
            <input {...api().getInputProps()} style={{ width: '100%' }} />
            <button {...api().getTriggerProps()}>
              { api().copied ? 'Copied' : 'Copy' }
            </button>
          </div>
          <div {...api().getIndicatorProps({ copied: true })}>
            Copied!
          </div>
          <div {...api().getIndicatorProps({ copied: false })}>
            Copy
          </div>
        </div>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
