import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { collapsibleControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function CollapsibleDemo() {
  const controls = useControls(collapsibleControls)

  const [state, send] = useMachine(collapsible.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = collapsible.connect(state, send, normalizeProps)

  return (
    <>
      <div
        className="max-w-md my-8 rounded-lg overflow-hidden shadow-md"
        {...api.getRootProps()}
      >
        <button
          className="group w-full px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          {...api.getTriggerProps()}
        >
          <span>Toggle Content</span>
          <div
            className={`
              text-sm transition-transform duration-300 ease-in-out
              group-data-[state=open]:rotate-180 i-carbon:chevron-down
            `}
          />
        </button>

        <div
          className="bg-white overflow-hidden content"
          {...api.getContentProps()}
        >
          <div className="p-4 leading-relaxed">
            <p className="text-gray-700 my-2">
              This is a collapsible demo content. You can place any content here that you want to show or hide.
            </p>
            <p className="text-gray-700 my-2">
              Click the button above to toggle the content state.
            </p>
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
