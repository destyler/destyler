import * as floatingPanel from '@destyler/floating-panel'
import { floatingPanelControls } from '@destyler/shared-private-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function FloatingPanel() {
  const controls = useControls(floatingPanelControls)

  const [state, send] = useMachine(floatingPanel.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => floatingPanel.connect(state, send, normalizeProps))

  return (
    <main class="floating-panel p-8">
      <div class="flex items-center justify-center">
        <button {...api().getTriggerProps()} class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Toggle Panel
        </button>
        <div {...api().getPositionerProps()}>
          <div {...api().getContentProps()} class="bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px] min-h-150px">
            <div {...api().getDragTriggerProps()} class="cursor-move">
              <div {...api().getHeaderProps()} class="flex items-center justify-between p-4 border-b border-gray-200">
                <p {...api().getTitleProps()} class="font-semibold text-gray-700">Floating Panel</p>
                <div data-scope="floating-panel" data-part="trigger-group" class="flex space-x-2">
                  <button {...api().getMinimizeTriggerProps()} class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div class="w-4 h-4 i-carbon:minimize" />
                  </button>
                  <button {...api().getMaximizeTriggerProps()} class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div class="w-4 h-4 i-carbon:maximize" />
                  </button>
                  <button {...api().getRestoreTriggerProps()} class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div class="w-4 h-4 i-carbon:arrow-down-left" />
                  </button>
                  <button {...api().getCloseTriggerProps()} class="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div class="w-4 h-4 i-carbon:close-large" />
                  </button>
                </div>
              </div>
            </div>
            <div {...api().getBodyProps()} class="p-4">
              <p class="text-gray-600">Some content</p>
            </div>

            <div {...api().getResizeTriggerProps({ axis: 'n' })} class="absolute top-0 left-0 right-0 h-1 cursor-ns-resize" />
            <div {...api().getResizeTriggerProps({ axis: 'e' })} class="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize" />
            <div {...api().getResizeTriggerProps({ axis: 'w' })} class="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize" />
            <div {...api().getResizeTriggerProps({ axis: 's' })} class="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize" />
            <div {...api().getResizeTriggerProps({ axis: 'ne' })} class="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" />
            <div {...api().getResizeTriggerProps({ axis: 'se' })} class="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" />
            <div {...api().getResizeTriggerProps({ axis: 'sw' })} class="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" />
            <div {...api().getResizeTriggerProps({ axis: 'nw' })} class="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" />
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </main>
  )
}
