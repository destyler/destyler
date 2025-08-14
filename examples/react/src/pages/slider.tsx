import { normalizeProps, useMachine } from '@destyler/react'
import { sliderControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as slider from '@destyler/slider'
import { useId } from 'react'
import '@destyler/shared-private/styles/slider.css'

export default function SliderPage() {
  const controls = useControls(sliderControls)

  const [state, send] = useMachine(slider.machine({
    id: useId(),
    value: [0],
  }), {
    context: controls.context,
  })

  const api = slider.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="slider-root">
        <div className="slider-header">
          <label {...api.getLabelProps()} className="slider-label">
            Slider Value
          </label>
          <output {...api.getValueTextProps()} className="slider-value-text">
            {api.value[0]}
          </output>
        </div>
        <div {...api.getControlProps()} className="slider-control">
          <div
            {...api.getTrackProps()}
            className="slider-track"
          >
            <div
              {...api.getRangeProps()}
              className="slider-range"
            />
          </div>
          {api.value.map((_, index) => (
            <div
              key={index}
              {...api.getThumbProps({ index })}
              className="slider-thumb"
            >
              <input {...api.getHiddenInputProps({ index })} className="slider-hidden-input" />
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
