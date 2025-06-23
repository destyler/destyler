import { normalizeProps, useMachine } from '@destyler/react'
import { toggleControls } from '@destyler/shared-private-private'
import * as toggle from '@destyler/toggle'
import { useId } from 'react'
import { useControls } from '../hooks/use-controls'

export default function TogglePage() {
  const controls = useControls(toggleControls)

  const [state, send] = useMachine(toggle.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = toggle.connect(state, send, normalizeProps)

  return (
    <>
      <div className="flex">
        <div
          {...api.getRootProps()}
          className="bg-white p-2 rounded-lg shadow-md space-x-2"
        >
          {['bold', 'italic', 'underline'].map(item => (
            <button
              key={item}
              {...api.getItemProps({ value: item })}
              className={`w-10 h-10 rounded-md border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium ${
                api.value.includes(item) ? 'bg-gray-800 text-white hover:bg-gray-700' : ''
              }`}
            >
              {item[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
