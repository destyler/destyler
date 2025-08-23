import * as separator from '@destyler/separator'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, For } from 'solid-js'

export default function Divider() {
  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id: crypto.randomUUID() }))
  const api = createMemo(() => separator.connect(state, send, normalizeProps))

  return (
    <div class="w-full max-w-75 mx-4">
      <div class="text-black text-sm font-semibold">
        Destyler UI
      </div>
      <div class="text-black text-sm">
        unstyled component for vue.
      </div>
      <div
        {...api().getRootProps()}
        class="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
      />
      <div class="flex h-5 items-center">
        <For each={items}>
          {(item, index) => (
            <>
              <div class="text-black text-sm">
                {item.label}
              </div>
              {index() < items.length - 1 && (
                <div
                  {...api().getRootProps('vertical')}
                  class="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
                />
              )}
            </>
          )}
        </For>
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
