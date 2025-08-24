/** @jsxImportSource solid-js */
import './index.css'
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'

export default function HoverCard() {
  const [state, send] = useMachine(hoverCard.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => hoverCard.connect(state, send, normalizeProps))

  return (
    <div class="wrapper">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api().getTriggerProps()}
        class="hover-trigger"
      >
        Hover
      </a>

      {api().open && (
        <Portal mount={document.body}>
          <div {...api().getPositionerProps()}>
            <div
              {...api().getContentProps()}
              class="hover-content"
            >
              <div class="hover-header">
                <img
                  src="https://github.com/elonehoo.png"
                  alt="Profile"
                  class="avatar"
                />
                <div class="user-info">
                  <h4 class="user-name">elonehoo</h4>
                  <p class="user-role">Frontend Developer</p>
                </div>
              </div>
              <div class="description">
                I hope every sunny afternoon can be wasted.
              </div>
              <div class="user-handle">
                <div class="handle-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M18.234 14.162L26.977 4h-2.072l-7.591 8.824L11.25 4H4.258l9.169 13.343L4.258 28H6.33l8.016-9.318L20.75 28h6.993zm-2.837 3.299l-.93-1.329L7.078 5.56h3.182l5.964 8.532l.93 1.329l7.753 11.09h-3.182z"/>
                  </svg>
                </div>
                @elonehoo
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
