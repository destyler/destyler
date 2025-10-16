<script lang="ts">
  import * as floatingPanel from '@destyler/floating-panel'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  function getCenterPosition(width = 320, height = 150) {
    if (typeof window === 'undefined') {
      return { x: 100, y: 100 }
    }
    const x = Math.max(0, Math.round((window.innerWidth - width) / 2))
    const y = Math.max(0, Math.round((window.innerHeight - height) / 2))
    return { x, y }
  }

  const [state, send] = useMachine(floatingPanel.machine({
    id,
    closeOnEscape: true,
    position: getCenterPosition(320, 150),
    resizable: true,
    draggable: true,
  }))

  const api = $derived(floatingPanel.connect(state, send, normalizeProps))
</script>

<button {...api.getTriggerProps()}>
  Open Floating Panel
</button>
<div use:portal>
  <div data-layout="sinppets">
    <div {...api.getPositionerProps()}>
      <div {...api.getContentProps()}>
        <div {...api.getDragTriggerProps()}>
          <div {...api.getHeaderProps()}>
            <p {...api.getTitleProps()}>
              title
            </p>
            <div class="flex items-center gap-1 mt-0!">
              <button {...api.getMinimizeTriggerProps()}>
                <div class="w-4 h-4 i-ph:minus-bold" ></div>
              </button>
              <button {...api.getMaximizeTriggerProps()}>
                <div class="w-4 h-4 i-ph:arrows-out-simple-bold" ></div>
              </button>
              <button {...api.getRestoreTriggerProps()}>
                <div class="w-4 h-4 i-ph:arrow-down-left-bold" ></div>
              </button>
              <button {...api.getCloseTriggerProps()}>
                <div class="w-4 h-4 i-ph:x-bold" ></div>
              </button>
            </div>
          </div>
        </div>
        <div {...api.getBodyProps()}>
          <p class="text-sm text-muted-foreground mt-0!">
            floating panel content
          </p>
        </div>
        <div {...api.getResizeTriggerProps({ axis: 'n' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 'e' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 'w' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 's' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 'ne' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 'se' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 'sw' })} ></div>
        <div {...api.getResizeTriggerProps({ axis: 'nw' })} ></div>
      </div>
    </div>
  </div>

</div>
