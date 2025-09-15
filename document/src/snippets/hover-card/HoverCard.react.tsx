import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/components/hover-card.css'

export default function HoverCard() {
  const [state, send] = useMachine(hoverCard.machine({
    id: useId(),
  }))

  const api = hoverCard.connect(state, send, normalizeProps)

  return (
    <div className=" mt-0!">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api.getTriggerProps()}
      >
        Hover
      </a>

      {api.open && createPortal(
        <div {...api.getPositionerProps()} data-layout="sinppets">
          <div {...api.getContentProps()}>
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
        </div>,
        document.body,
      )}
    </div>
  )
}
