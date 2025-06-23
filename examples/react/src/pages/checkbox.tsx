import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/react'
import { checkboxControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function CheckboxPage() {
  const id = useId()

  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine({ id }), {
    context: controls.context,
  })

  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <>
      <label {...api.getRootProps()} className="flex gap-2.5 justify-start items-center cursor-pointer">
        <div
          {...api.getControlProps()}
          className="h-4 w-4 shrink-0 rounded-sm border border-dark
            shadow focus-visible:outline-none focus-visible:ring-1
            disabled:cursor-not-allowed disabled:opacity-50
            data-[state=checked]:bg-dark data-[state=checked]:text-light
            flex justify-center items-center"
        >
          {api.checked && <div className="i-carbon:checkmark w-3 h-3 text-light" />}
        </div>
        <span {...api.getLabelProps()}>
          Input is
          {api.checked ? <span> checked</span> : <span> unchecked</span>}
        </span>

        <input {...api.getHiddenInputProps()} />
      </label>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
