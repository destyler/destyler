import * as aspectRatio from '@destyler/aspect-ratio'
import { aspectRatioControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

function AspectRatio() {
  const controls = useControls(aspectRatioControls)

  const [state, send] = useMachine(aspectRatio.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })
  const api = createMemo(() => aspectRatio.connect(state, send, normalizeProps))
  return (
    <>
      <div class="w-full sm:w-75 overflow-hidden rounded-md">
        <div {...api().getRootProps()}>
          <div {...api().getContentProps()}>
            <img
              class="h-full w-full object-cover"
              src="https://elonehoo.me/gallery/20_sun.jpg"
            />
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default AspectRatio
