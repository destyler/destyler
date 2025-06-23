import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/react'
import { floatingPanelControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function FloatingPanel() {
  const controls = useControls(floatingPanelControls)

  const [state, send] = useMachine(floatingPanel.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = floatingPanel.connect(state, send, normalizeProps)

  return (
    <main className="floating-panel p-8">
      <div className="flex items-center justify-center">
        <button {...api.getTriggerProps()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Toggle Panel
        </button>
        <div {...api.getPositionerProps()}>
          <div {...api.getContentProps()} className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px] min-h-150px">
            <div {...api.getDragTriggerProps()} className="cursor-move">
              <div {...api.getHeaderProps()} className="flex items-center justify-between p-4 border-b border-gray-200">
                <p {...api.getTitleProps()} className="font-semibold text-gray-700">Floating Panel</p>
                <div data-scope="floating-panel" data-part="trigger-group" className="flex space-x-2">
                  <button {...api.getMinimizeTriggerProps()} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div className="w-4 h-4 i-carbon:minimize" />
                  </button>
                  <button {...api.getMaximizeTriggerProps()} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div className="w-4 h-4 i-carbon:maximize" />
                  </button>
                  <button {...api.getRestoreTriggerProps()} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div className="w-4 h-4 i-carbon:arrow-down-left" />
                  </button>
                  <button {...api.getCloseTriggerProps()} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                    <div className="w-4 h-4 i-carbon:close-large" />
                  </button>
                </div>
              </div>
            </div>
            <div {...api.getBodyProps()} className="p-4">
              <p className="text-gray-600">Some content</p>
            </div>

            <div {...api.getResizeTriggerProps({ axis: 'n' })} className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize" />
            <div {...api.getResizeTriggerProps({ axis: 'e' })} className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize" />
            <div {...api.getResizeTriggerProps({ axis: 'w' })} className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize" />
            <div {...api.getResizeTriggerProps({ axis: 's' })} className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize" />
            <div {...api.getResizeTriggerProps({ axis: 'ne' })} className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" />
            <div {...api.getResizeTriggerProps({ axis: 'se' })} className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" />
            <div {...api.getResizeTriggerProps({ axis: 'sw' })} className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" />
            <div {...api.getResizeTriggerProps({ axis: 'nw' })} className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" />
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </main>
  )
}
