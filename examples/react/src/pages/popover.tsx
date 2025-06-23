import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/react'
import { popoverControls } from '@destyler/shared-private-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function PopoverPage() {
  const controls = useControls(popoverControls)

  const [state, send] = useMachine(popover.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = popover.connect(state, send, normalizeProps)

  return (
    <>
      <div className="mt-5">
        <button
          {...api.getTriggerProps()}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Click me
        </button>

        <div {...api.getPositionerProps()} className="z-50">
          <div
            {...api.getContentProps()}
            className="bg-white shadow-lg rounded-lg border border-gray-200 w-64 p-4 mt-2"
          >
            <div
              {...api.getTitleProps()}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Presenters
            </div>

            <div
              {...api.getDescriptionProps()}
              className="text-gray-600 mb-4"
            >
              Description
            </div>

            <button className="w-full mb-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Action Button
            </button>

            <button
              {...api.getCloseTriggerProps()}
              className="absolute top-5 right-3 text-gray-400 hover:text-gray-600 i-carbon:close-large"
            >
            </button>
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
