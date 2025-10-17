import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { aspectRatioControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as aspectRatio from '../index'
import './style.css'

const AspectRatio: FC = () => {
  const controls = useControls(aspectRatioControls)

  const [state, send] = useMachine(aspectRatio.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = aspectRatio.connect(state, send, normalizeProps)

  return (
    <Layout>
      <div className="aspect-ratio-root">
        <div {...api.getRootProps()}>
          <div {...api.getContentProps()}>
            <img
              className="aspect-ratio-img"
              src="https://elonehoo.me/gallery/20_sun.jpg"
            />
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}

export default AspectRatio
