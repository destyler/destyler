import * as collapse from '@destyler/collapse'
import { collapseControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

export default function CollapsePage() {
  const controls = useControls(collapseControls)

  const data = [
    {
      title: 'Watercraft',
      content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
    },
    {
      title: 'Automobiles',
      content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
    },
    {
      title: 'Aircraft',
      content: 'Explore our range of aircraft, from private jets to commercial airliners, all equipped with state-of-the-art technology.',
    },
  ]

  const [state, send] = useMachine(collapse.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => collapse.connect(state, send, normalizeProps))

  return (
    <>
      <div
        {...api().getRootProps()}
        class="max-w-[600px] my-8 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-200/50"
      >
        {data.map(item => (
          <div
            {...api().getItemProps({ value: item.title })}
            class="border-b border-gray-100 last:border-none"
          >
            <h3 class="m-0">
              <button
                {...api().getItemTriggerProps({ value: item.title })}
                class="group w-full px-6 py-5 flex justify-between items-center bg-transparent hover:bg-gray-50/50 transition-all duration-300"
              >
                <div class="flex items-center gap-3">
                  <span class="text-left text-base font-medium text-gray-700 transition-colors">
                    {item.title}
                  </span>
                </div>
                <div
                  class="transition-transform duration-300 i-carbon:chevron-right w-4 h-4 text-gray-400 group-data-[state=open]:rotate-90"
                />
              </button>
            </h3>
            <div
              {...api().getItemContentProps({ value: item.title })}
              class="transition-all duration-300 overflow-hidden max-h-0 opacity-0 data-[state=open]:max-h-[200px] data-[state=open]:opacity-100"
            >
              <div class="px-6 py-4 text-gray-600 bg-gray-50/50">
                <p class="leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
