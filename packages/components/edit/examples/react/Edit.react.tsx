import { normalizeProps, useMachine } from '@destyler/react'
import { editControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as edit from '../../index'
import '../style.css'

export default function EditPage() {
  const controls = useControls(editControls)

  const [state, send] = useMachine(edit.machine({
    id: useId(),
    value: 'Hello World',
  }), {
    context: controls.context,
  })

  const api = edit.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <div {...api.getAreaProps()}>
            <input {...api.getInputProps()} />
            <span {...api.getPreviewProps()} />
          </div>
          <div>
            {api.editing
              ? (
                  <>
                    <button {...api.getSubmitTriggerProps()}>
                      Save
                    </button>
                    <button {...api.getCancelTriggerProps()}>
                      Cancel
                    </button>
                  </>
                )
              : (
                  <button {...api.getEditTriggerProps()}>
                    Edit
                  </button>
                )}
          </div>
        </div>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
