import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { numberInputControls } from '@destyler/shared-private-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function NumberInputExample() {
  const controls = useControls(numberInputControls)

  const [state, send] = useMachine(numberInput.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = numberInput.connect(state, send, normalizeProps)

  return (
    <>
      <div
        className="max-w-[300px] mx-auto my-5 p-4"
        {...api.getRootProps()}
      >
        <label
          className="block mb-2 text-sm text-gray-700"
          {...api.getLabelProps()}
        >
          Enter number
        </label>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
            {...api.getDecrementTriggerProps()}
          >
            <span className="text-xl font-bold">-</span>
          </button>
          <input
            className="w-full h-10 px-2 text-center text-gray-700 border border-gray-200 rounded-md outline-none transition-colors duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            {...api.getInputProps()}
          />
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
            {...api.getIncrementTriggerProps()}
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
