/** @jsxImportSource solid-js */
import * as hoverCard from '@destyler/hover-card'
import { hoverCardControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/hover-card.css'

export default function HoverCard() {
  const controls = useControls(hoverCardControls)
  const id = createUniqueId()

  const [state, send] = useMachine(hoverCard.machine({ id }), {
    context: controls.context,
  })

  const api = createMemo(() => hoverCard.connect(state, send, normalizeProps))

  return (
    <div class="hover-card-root">
      <span data-testid="hover-card-test-click">click</span>
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api().getTriggerProps()}
        class="hover-card-trigger"
      >
        Twitter
      </a>
      <div {...api().getPositionerProps()}>
        <div
          {...api().getContentProps()}
          class="hover-card-content"
        >
          <div class="hover-card-context">
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
              class="hover-card-avatar"
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
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
