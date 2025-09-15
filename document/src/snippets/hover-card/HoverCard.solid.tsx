/** @jsxImportSource solid-js */
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import '../../styles/components/hover-card.css'

export default function HoverCard() {
  const [state, send] = useMachine(hoverCard.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => hoverCard.connect(state, send, normalizeProps))

  return (
    <div class=" mt-0!">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api().getTriggerProps()}
      >
        Hover
      </a>

      {api().open && (
        <Portal mount={document.body}>
          <div {...api().getPositionerProps()} data-layout="sinppets">
            <div {...api().getContentProps()}>
              <div>
                <img
                  src="https://github.com/elonehoo.png"
                  alt="Profile"
                />
                <div>
                  <h4>elonehoo</h4>
                  <p>Frontend Developer</p>
                </div>
              </div>
              <div>
                I hope every sunny afternoon can be wasted.
              </div>
              <div>
                <div />
                @elonehoo
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
