import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'

export default function ImageDemo() {
  const [state, send] = useMachine(image.machine({ id: createUniqueId() }))
  const api = createMemo(() => image.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <div {...api().getFallbackProps()} class="h-full w-full rounded-full bg-dark text-white">
          EH
        </div>
        <img
          alt="EH"
          src="https://github.com/elonehoo.png"
          {...api().getImageProps()}
          class="aspect-square h-full w-full"
        />
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
