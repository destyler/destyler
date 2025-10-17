/** @jsxImportSource solid-js */
import { aspectRatioControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as aspectRatio from '../index'
import './style.css'

function AspectRatio() {
  const controls = useControls(aspectRatioControls)

  const [state, send] = useMachine(aspectRatio.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })
  const api = createMemo(() => aspectRatio.connect(state, send, normalizeProps))
  return (
    <Layout>
      <div class="aspect-ratio-root">
        <div {...api().getRootProps()}>
          <div {...api().getContentProps()}>
            <img
              class="aspect-ratio-img"
              src="https://elonehoo.me/gallery/20_sun.jpg"
            />
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}

export default AspectRatio
