import { normalizeProps, useMachine } from '@destyler/react'
import { sliderControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as slider from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(sliderControls)

  const [state, send] = useMachine(
    slider.machine({
      id: useId(),
      name: 'quantity',
      value: [0],
    }),
    {
      context: controls.context,
    },
  )

  const api = slider.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main className="slider">
        <form>
          <div {...api.getRootProps()}>
            <div>
              <label data-testid="label" {...api.getLabelProps()}>
                Slider Label
              </label>
              <output data-testid="output" {...api.getValueTextProps()}>
                {api.value}
              </output>
            </div>
            <div className="control-area">
              <div {...api.getControlProps()}>
                <div data-testid="track" {...api.getTrackProps()}>
                  <div {...api.getRangeProps()} />
                </div>
                <span {...api.getDraggingIndicatorProps({ index: 0 })}>{api.getThumbValue(0)}</span>
                {api.value.map((_, index) => (
                  <div key={index} {...api.getThumbProps({ index })}>
                    <input {...api.getHiddenInputProps({ index })} />
                  </div>
                ))}
              </div>
              <div {...api.getMarkerGroupProps()}>
                <span {...api.getMarkerProps({ value: 10 })}>*</span>
                <span {...api.getMarkerProps({ value: 30 })}>*</span>
                <span {...api.getMarkerProps({ value: 90 })}>*</span>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
