/** @jsxImportSource solid-js */
import * as separator from '@destyler/separator'
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
    <div class="w-full min-w-90 mx-4">
      <div class="text-primary text-sm font-semibold">
        Destyler UI
      </div>
      <div class="text-primary text-sm mt-0!">
        unstyled component for solid.
      </div>
      <div
        {...api().getRootProps()}
        class="bg-stone-300/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
      />
      <div class="flex h-5 items-center mt-0!">
        <For each={items}>
          {(item, index) => (
            <>
              <div class="text-primary text-sm mt-0!">
                {item.label}
              </div>
              {index() < items.length - 1 && (
                <div
                  {...api().getRootProps('vertical')}
                  class="bg-stone-300/50 mt-0! data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
                />
              )}
            </>
          )}
        </For>
      </div>
    </div>
  )
}
