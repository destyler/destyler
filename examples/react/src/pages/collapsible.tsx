import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { collapsibleControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/collapsible.css'

export default function CollapsibleDemo() {
  const controls = useControls(collapsibleControls)

  const [state, send] = useMachine(collapsible.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = collapsible.connect(state, send, normalizeProps)

  return (
    <>
      <div
        className="collapsible-root"
        {...api.getRootProps()}
      >
        <button
          className="group collapsible-trigger"
          {...api.getTriggerProps()}
        >
          <span>Toggle Content</span>
          <div
            className={`
              collapsible-trigger-icon
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
          </div>
        </button>

        <div
          className="content"
          {...api.getContentProps()}
        >
          <div className="p-4 leading-relaxed">
            <p className="desc">
              This is a collapsible demo content. You can place any content here that you want to show or hide.
            </p>
            <p className="desc">
              Click the button above to toggle the content state.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div>Toggle Controls</div>
        <button className="button" onClick={() => api.setOpen(true)}>
          Open
        </button>
        <button className="button" onClick={() => api.setOpen(false)}>
          Close
        </button>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
