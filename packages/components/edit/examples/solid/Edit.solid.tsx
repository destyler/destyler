/** @jsxImportSource solid-js */
import { editControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Show } from 'solid-js/web'
import * as edit from '../../index'
import '../style.css'

export default function Edit() {
  const controls = useControls(editControls)

  const [state, send] = useMachine(edit.machine({
    id: createUniqueId(),
    value: 'Hello World',
  }), {
    context: controls.context,
  })

  const api = createMemo(() => edit.connect(state, send, normalizeProps))

  return (
    <Layout>
      <div {...api().getRootProps()}>
        <div {...api().getAreaProps()}>
          <input {...api().getInputProps()} />
          <span {...api().getPreviewProps()} />
        </div>
        <div>
          <Show when={api().editing} fallback={<button {...api().getEditTriggerProps()}>Edit</button>}>
            <div>
              <button {...api().getSubmitTriggerProps()}>
                Save
              </button>
              <button {...api().getCancelTriggerProps()}>
                Cancel
              </button>
            </div>
          </Show>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
