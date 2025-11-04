/** @jsxImportSource solid-js */

import { progressControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as progress from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(progressControls)

  const [state, send] = useMachine(progress.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => progress.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <div {...api().getLabelProps()}>Upload progress</div>

          <svg {...api().getCircleProps()}>
            <circle {...api().getCircleTrackProps()} />
            <circle {...api().getCircleRangeProps()} />
          </svg>

          <div {...api().getTrackProps()}>
            <div {...api().getRangeProps()} />
          </div>
          <div {...api().getValueTextProps()}>{api().valueAsString}</div>
          <div>
            <button onClick={() => api().setValue((api().value ?? 0) - 20)}>Decrease</button>
            <button onClick={() => api().setValue((api().value ?? 0) + 20)}>Increase</button>
            <button onClick={() => api().setValue(null)}>Indeterminate</button>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
