import { normalizeProps, useMachine } from '@destyler/react'
import { switchControls } from '@destyler/shared'
import * as switchs from '@destyler/switch'
import { useId, useMemo } from 'react'
import { useControls } from '../hooks/use-controls'

export default function SwitchPage() {
  const controls = useControls(switchControls)
  const id = useId()

  const [state, send] = useMachine(switchs.machine({ id }), {
    context: controls.context,
  })

  const api = useMemo(() =>
    switchs.connect(state, send, normalizeProps), [state, send])

  return (
    <>
      <label
        {...api.getRootProps()}
        className="inline-flex items-center space-x-3 cursor-pointer"
      >
        <input {...api.getHiddenInputProps()} />
        <span
          {...api.getControlProps()}
          className="
            peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
            rounded-full border-2 border-gray-200 transition-colors duration-200 ease-in-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            hover:border-gray-300
            data-[state=checked]:bg-black data-[state=checked]:border-black
            data-[state=unchecked]:bg-gray-100
          "
        >
          <span
            {...api.getThumbProps()}
            className="
              pointer-events-none block h-4 w-4 rounded-full bg-white
              shadow-lg ring-0 transition-transform duration-200 ease-in-out
              data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0
            "
          />
        </span>
        <span
          {...api.getLabelProps()}
          className="text-sm font-medium text-gray-700"
        >
          {api.checked ? 'open' : 'close'}
        </span>
      </label>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
