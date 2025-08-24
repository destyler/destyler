/** @jsxImportSource solid-js */
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Image() {
  const [state, send] = useMachine(image.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => image.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="relative mt-0! flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <img
        alt="EH"
        src="https://github.com/destyler.png"
        {...api().getImageProps()}
        class="aspect-square h-full w-full"
      />
      <div
        {...api().getFallbackProps()}
        class="flex h-full w-full items-center justify-center rounded-full bg-muted"
      >
        EH
      </div>
    </div>
  )
}
