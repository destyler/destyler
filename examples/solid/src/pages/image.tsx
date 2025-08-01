import * as image from '@destyler/image'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/image.css'

export default function ImageDemo() {
  const [state, send] = useMachine(image.machine({ id: createUniqueId() }))
  const api = createMemo(() => image.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="image-root">
        <div {...api().getFallbackProps()} class="image-fallback">
          EH
        </div>
        <img
          alt="EH"
          src="https://github.com/elonehoo.png"
          {...api().getImageProps()}
          class="image-img"
        />
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
