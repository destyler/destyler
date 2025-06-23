import type { FC } from 'react'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { aspectRatioControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

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
      <div className="w-full sm:w-75 overflow-hidden rounded-md">
        <div {...api.getRootProps()}>
          <div {...api.getContentProps()}>
            <img
              className="h-full w-full object-cover"
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
