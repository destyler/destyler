import { normalizeProps, useMachine } from '@destyler/react'
import { sliderControls } from '@destyler/shared-private'
import * as slider from '@destyler/slider'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function SliderPage() {
  const controls = useControls(sliderControls)

  const [state, send] = useMachine(slider.machine({
    id: useId(),
    value: [12],
  }), {
    context: controls.context,
  })

  const api = slider.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="max-w-md mx-auto p-6">
        <div className="mb-4 flex justify-between items-center">
          <label {...api.getLabelProps()} className="text-gray-700 font-medium">
            Slider Value
          </label>
          <output {...api.getValueTextProps()} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {api.value[0]}
          </output>
        </div>
        <div {...api.getControlProps()} className="relative py-4">
          <div
            {...api.getTrackProps()}
            className="w-full h-2 bg-gray-200 rounded-full"
          >
            <div
              {...api.getRangeProps()}
              className="h-2 bg-gray-600 rounded-full"
            />
          </div>
          {api.value.map((_, index) => (
            <div
              key={index}
              {...api.getThumbProps({ index })}
              className="absolute top-2.5 w-5 h-5 bg-white border-2 border-gray-600 rounded-full cursor-pointer transform -translate-y-1/2 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <input {...api.getHiddenInputProps({ index })} />
            </div>
          ))}
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
