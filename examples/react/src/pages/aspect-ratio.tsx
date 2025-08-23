import type { FC } from 'react'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { aspectRatioControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/aspect-ratio.css'

const AspectRatio: FC = () => {
  const controls = useControls(aspectRatioControls)

  const [state, send] = useMachine(aspectRatio.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = aspectRatio.connect(state, send, normalizeProps)

  return (
    <>
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
    </>
  )
}

export default AspectRatio
