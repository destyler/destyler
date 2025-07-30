import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/react'
import { hoverCardControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/hover-card.css'

export default function HoverCard() {
  const controls = useControls(hoverCardControls)

  const [state, send] = useMachine(hoverCard.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = hoverCard.connect(state, send, normalizeProps)

  return (
    <div className="hover-card-root">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api.getTriggerProps()}
        className="hover-card-trigger"
      >
        Twitter
      </a>
      <div {...api.getPositionerProps()}>
        <div
          {...api.getContentProps()}
          className="hover-card-content"
        >
          <div className="hover-card-context">
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
              className="hover-card-avatar"
            />
            <div>
              <h3>elonehoo</h3>
              <p>Frontend Developer</p>
            </div>
          </div>
          <div>
            Follow me on Twitter for web development tips and updates!
          </div>
          <div>
            @elonehoo
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
