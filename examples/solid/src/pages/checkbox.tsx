import * as checkbox from '@destyler/checkbox'
import { checkboxControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function CheckboxPage() {
  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine({
    id: createUniqueId(),
    checked: false,
  }), {
    context: controls.context,
  })

  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <>
      <label {...api.getRootProps()} class="flex gap-2.5 justify-start items-center cursor-pointer">
        <div
          {...api.getControlProps()}
          class="h-4 w-4 shrink-0 rounded-sm border border-dark shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-dark data-[state=checked]:text-light flex justify-center items-center"
        >
          {api.checked && <div class="i-carbon:checkmark w-3 h-3 text-light" />}
        </div>
        <span {...api.getLabelProps()}>
          Input is
          { api.checked }
        </span>

        <input {...api.getHiddenInputProps()} />
      </label>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
