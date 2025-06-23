import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/react'
import { dialogControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function DialogExample() {
  const controls = useControls(dialogControls)

  const [state, send] = useMachine(dialog.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = dialog.connect(state, send, normalizeProps)

  return (
    <>
      <button
        {...api.getTriggerProps()}
        className="px-4 py-2 bg-dark text-white rounded-md hover:bg-black transition-colors"
      >
        Open Dialog
      </button>
      <div>
        <div
          {...api.getBackdropProps()}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />
        <div
          {...api.getPositionerProps()}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div
            {...api.getContentProps()}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border border-gray-200"
          >
            <h2
              {...api.getTitleProps()}
              className="text-xl font-semibold text-black mb-4"
            >
              Edit profile
            </h2>
            <p
              {...api.getDescriptionProps()}
              className="text-gray-500 mb-6"
            >
              Make changes to your profile here. Click save when you are done.
            </p>
            <button
              {...api.getCloseTriggerProps()}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <div className="w-4 h-4 i-carbon:close-large" />
            </button>
            <input
              placeholder="Enter name..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="w-full px-4 py-2 bg-dark text-white rounded-md hover:bg-black transition-colors">
              Save Changes
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
