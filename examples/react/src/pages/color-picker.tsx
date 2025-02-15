import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/react'
import { colorPickerControls } from '@destyler/shared'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function ColorPicker() {
  const controls = useControls(colorPickerControls)
  const id = useId()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(0, 100%, 50%)'),
  }), {
    context: controls.context,
  })

  const api = colorPicker.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="p-4">
      <label {...api.getLabelProps()} className="block mb-2 text-lg font-medium text-gray-700">
        Select Color:
        {' '}
        {api.valueAsString}
      </label>
      <input {...api.getHiddenInputProps()} />
      <div {...api.getControlProps()} className="flex items-center gap-4 mb-4">
        <button {...api.getTriggerProps()} className="relative flex justify-center items-center w-24 h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div {...api.getTransparencyGridProps({ size: '10px' })} className="absolute inset-0" />
          <div {...api.getSwatchProps({ value: api.value })} className="absolute inset-0 w-22 h-22 bg-[--color] rounded-md" />
        </button>
        <div className="flex flex-col gap-2">
          <input
            {...api.getChannelInputProps({ channel: 'hex' })}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            {...api.getChannelInputProps({ channel: 'alpha' })}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div {...api.getPositionerProps()} className="fixed mt-2 z-50 border border-gray/40 rounded-md">
        <div {...api.getContentProps()} className="p-4 bg-white rounded-lg shadow-xl">
          <div {...api.getAreaProps()} className="relative w-64 h-40 mb-4">
            <div {...api.getAreaBackgroundProps()} className="absolute inset-0 rounded-lg w-full h-full" />
            <div {...api.getAreaThumbProps()} className="absolute w-4 h-4 -translate-x-2 -translate-y-2 border-2 border-white rounded-full shadow-md cursor-pointer" />
          </div>

          <div {...api.getChannelSliderProps({ channel: 'hue' })} className="relative h-5 mb-4">
            <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} className="absolute inset-0 rounded-md h-full" />
            <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} className="absolute w-3 h-5 -translate-x-1.5 bg-white rounded-sm shadow-md cursor-pointer" />
          </div>

          <div {...api.getChannelSliderProps({ channel: 'alpha' })} className="relative h-5">
            <div {...api.getTransparencyGridProps({ size: '12px' })} className="absolute inset-0 rounded-md" />
            <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} className="absolute inset-0 rounded-md h-full" />
            <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} className="absolute w-3 h-5 -translate-x-1.5 bg-white rounded-sm shadow-md cursor-pointer" />
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
