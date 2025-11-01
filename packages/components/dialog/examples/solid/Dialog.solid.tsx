/** @jsxImportSource solid-js */
import { dialogControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import * as dialog from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(dialogControls)

  const [state, send] = useMachine(dialog.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })
  const api = createMemo(() => dialog.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <button {...api().getTriggerProps()}> Click me</button>
        {api().open && (
          <Portal>
            <div {...api().getBackdropProps()} />
            <div {...api().getPositionerProps()}>
              <div {...api().getContentProps()}>
                <h2 {...api().getTitleProps()}>Edit profile</h2>
                <p {...api().getDescriptionProps()}>Make changes to your profile here. Click save when you are done.</p>
                <div>
                  <input placeholder="Enter name..." />
                  <button>Save</button>
                </div>
                <button {...api().getCloseTriggerProps()}>x</button>
              </div>
            </div>
          </Portal>
        )}
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
