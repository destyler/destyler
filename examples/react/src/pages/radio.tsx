import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/react'
import { radioControls } from '@destyler/shared'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function RadioDemo() {
  const controls = useControls(radioControls)

  const items = [
    { id: 'apple', label: 'Apples' },
    { id: 'orange', label: 'Oranges' },
    { id: 'mango', label: 'Mangoes' },
    { id: 'grape', label: 'Grapes' },
  ]

  const [state, send] = useMachine(radio.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = radio.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="max-w-md p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 {...api.getLabelProps()} className="text-xl font-semibold mb-4 text-gray-800">
          Fruits
        </h3>
        {items.map(opt => (
          <div key={opt.id} className="mb-3">
            <label
              {...api.getItemProps({ value: opt.id })}
              className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <input {...api.getItemHiddenInputProps({ value: opt.id })} />
              <div
                {...api.getItemControlProps({ value: opt.id })}
                className="w-4 h-4 border-2 border-gray-300 rounded-full transition-colors data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <span
                {...api.getItemTextProps({ value: opt.id })}
                className="text-gray-700 group-hover:text-gray-900"
              >
                {opt.label}
              </span>
            </label>
          </div>
        ))}
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
