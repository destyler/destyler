/** @jsxImportSource solid-js */
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import './style.css'

function getCenterPosition(width = 320, height = 150) {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 }
  }
  const x = Math.max(0, Math.round((window.innerWidth - width) / 2))
  const y = Math.max(0, Math.round((window.innerHeight - height) / 2))
  return { x, y }
}

export default function FloatingPanel() {
  const [state, send] = useMachine(floatingPanel.machine({
    id: createUniqueId(),
    closeOnEscape: true,
    position: getCenterPosition(320, 150),
    resizable: true,
    draggable: true,
  }))

  const api = createMemo(() => floatingPanel.connect(state, send, normalizeProps))

  return (
    <>
      <button {...api().getTriggerProps()}>
        Open Floating Panel
      </button>
      <Portal>
        <div data-layout="sinppets">
          <div {...api().getPositionerProps()}>
            <div {...api().getContentProps()}>
              <div {...api().getDragTriggerProps()}>
                <div {...api().getHeaderProps()}>
                  <p {...api().getTitleProps()}>
                    title
                  </p>
                  <div class="flex mt-0! items-center gap-1">
                    <button {...api().getMinimizeTriggerProps()}>
                      <div class="w-4 h-4 i-ph:minus-bold"></div>
                    </button>
                    <button {...api().getMaximizeTriggerProps()}>
                      <div class="w-4 h-4 i-ph:arrows-out-simple-bold"></div>
                    </button>
                    <button {...api().getRestoreTriggerProps()}>
                      <div class="w-4 h-4 i-ph:arrow-down-left-bold"></div>
                    </button>
                    <button {...api().getCloseTriggerProps()}>
                      <div class="w-4 h-4 i-ph:x-bold"></div>
                    </button>
                  </div>
                </div>
              </div>
              <div {...api().getBodyProps()}>
                <p class="text-sm text-muted-foreground mt-0!">
                  floating panel content
                </p>
              </div>

              <div {...api().getResizeTriggerProps({ axis: 'n' })} />
              <div {...api().getResizeTriggerProps({ axis: 'e' })} />
              <div {...api().getResizeTriggerProps({ axis: 'w' })} />
              <div {...api().getResizeTriggerProps({ axis: 's' })} />
              <div {...api().getResizeTriggerProps({ axis: 'ne' })} />
              <div {...api().getResizeTriggerProps({ axis: 'se' })} />
              <div {...api().getResizeTriggerProps({ axis: 'sw' })} />
              <div {...api().getResizeTriggerProps({ axis: 'nw' })} />
            </div>
          </div>
        </div>
      </Portal>
    </>
  )
}
