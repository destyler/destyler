/** @jsxImportSource solid-js */
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

function AspectRatio() {

  const [state, send] = useMachine(aspectRatio.machine({
    id: createUniqueId(),
    ratio: 16 / 9,
  }))
  const api = createMemo(() => aspectRatio.connect(state, send, normalizeProps))
  return (
    <>
      <div class="w-full! sm:w-75! overflow-hidden! rounded-md!">
        <div {...api().getRootProps()}>
          <div {...api().getContentProps()}>
            <img
              class="h-full! w-full! object-cover!"
              src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AspectRatio
