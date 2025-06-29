import * as collapsible from '@destyler/collapsible'
import { collapsibleControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

export default function CollapsibleDemo() {
  const controls = useControls(collapsibleControls)

  const [state, send] = useMachine(collapsible.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => collapsible.connect(state, send, normalizeProps))

  return (
    <>
      <div
        class="max-w-md my-8 rounded-lg overflow-hidden shadow-md"
        {...api().getRootProps()}
      >
        <button
          class="group w-full px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          {...api().getTriggerProps()}
        >
          <span>Toggle Content</span>
          <div
            class={`
              text-sm transition-transform duration-300 ease-in-out
              group-data-[state=open]:rotate-180 i-carbon:chevron-down
            `}
          />
        </button>

        <div
          class="bg-white overflow-hidden content"
          {...api().getContentProps()}
        >
          <div class="p-4 leading-relaxed">
            <p class="text-gray-700 my-2">
              This is a collapsible demo content. You can place any content here that you want to show or hide.
            </p>
            <p class="text-gray-700 my-2">
              Click the button above to toggle the content state.
            </p>
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
