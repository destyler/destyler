/** @jsxImportSource solid-js */

import { sliderControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import * as slider from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(sliderControls)

  const [state, send] = useMachine(slider.machine({ id: createUniqueId(), value: [0] }), {
    context: controls.context,
  })

  const api = createMemo(() => slider.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="slider">
        <form>
          <div {...api().getRootProps()}>
            <div>
              <label data-testid="label" {...api().getLabelProps()}>
                Slider Label
              </label>
              <output data-testid="output" {...api().getValueTextProps()}>
                {api().value.at(0)}
              </output>
            </div>
            <div class="control-area">
              <div {...api().getControlProps()}>
                <div data-testid="track" {...api().getTrackProps()}>
                  <div {...api().getRangeProps()} />
                </div>
                <For each={api().value}>
                  {(_, index) => (
                    <div {...api().getThumbProps({ index: index() })}>
                      <input {...api().getHiddenInputProps({ index: index() })} />
                    </div>
                  )}
                </For>
              </div>
              <div {...api().getMarkerGroupProps()}>
                <span {...api().getMarkerProps({ value: 10 })}>*</span>
                <span {...api().getMarkerProps({ value: 30 })}>*</span>
                <span {...api().getMarkerProps({ value: 90 })}>*</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
