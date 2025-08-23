/** @jsxImportSource solid-js */
import { sliderControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import '@destyler/shared-private/styles/slider.css'

export default function SliderPage() {
  const controls = useControls(sliderControls)
  const id = createUniqueId()

  const [state, send] = useMachine(slider.machine({
    id,
    value: [0],
  }), {
    context: controls.context,
  })

  const api = createMemo(() => slider.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="slider-root">
        <div class="slider-header">
          <label {...api().getLabelProps()} class="slider-label">
            Slider Value
          </label>
          <output {...api().getValueTextProps()} class="slider-value-text">
            {api().value[0]}
          </output>
        </div>
        <div {...api().getControlProps()} class="slider-control">
          <div
            {...api().getTrackProps()}
            class="slider-track"
          >
            <div
              {...api().getRangeProps()}
              class="slider-range"
            />
          </div>
          <For each={api().value}>
            {(_, index) => (
              <div
                {...api().getThumbProps({ index: index() })}
                class="slider-thumb"
              >
                <input {...api().getHiddenInputProps({ index: index() })} class="slider-hidden-input" />
              </div>
            )}
          </For>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
