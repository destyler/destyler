import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'

export default function ColorPicker() {
  const id = useId()
  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(240,5.9%,10%)'),
  }))

  const api = colorPicker.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="mt-0!">
      <input {...api.getHiddenInputProps()} />
      <div {...api.getControlProps()} className="flex items-center gap-3 mt-1.5!">
        <button
          {...api.getTriggerProps()}
          className="relative flex justify-center items-center size-16 border border-border rounded-md overflow-hidden outline-none transition-colors"
        >
          <div {...api.getTransparencyGridProps({ size: '8px' })} className="absolute inset-0 bg-transparent! [background-image:none]!" />
          <div {...api.getSwatchProps({ value: api.value })} className="absolute mt-0! inset-0 w-full h-full bg-[--color]" />
        </button>
        <div className="flex flex-col gap-1.5 mt-0!">
          <input
            {...api.getChannelInputProps({ channel: 'hex' })}
            className="flex h-8 w-32 rounded-md border text-primary! border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <input
            {...api.getChannelInputProps({ channel: 'alpha' })}
            className="flex h-8 w-32 rounded-md border text-primary! border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {api.open && createPortal(
        <div {...api.getPositionerProps()} className="fixed mt-2 z-180!">
          <div {...api.getContentProps()} className="rounded-md border border-input bg-popover p-3 text-popover-foreground shadow-md outline-none">
            <div {...api.getAreaProps()} className="relative w-48 h-32 mb-3">
              <div {...api.getAreaBackgroundProps()} className="absolute inset-0 rounded-md w-full h-full" />
              <div {...api.getAreaThumbProps()} className="absolute w-3 h-3 -translate-x-1.5 -translate-y-1.5 border-2 border-white rounded-full shadow-sm cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>

            <div {...api.getChannelSliderProps({ channel: 'hue' })} className="relative h-4 mb-3">
              <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} className="absolute inset-0 rounded-md h-full" />
              <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} className="absolute w-2 h-4 border border-dark dark:border-light -translate-x-1 bg-background rounded-sm shadow-sm cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>

            <div {...api.getChannelSliderProps({ channel: 'alpha' })} className="relative h-4">
              <div {...api.getTransparencyGridProps({ size: '8px' })} className="absolute inset-0 rounded-md" />
              <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} className="absolute inset-0 rounded-md h-full" />
              <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} className="absolute w-2 h-4 border border-dark dark:border-light -translate-x-1 bg-background rounded-sm shadow-sm cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
