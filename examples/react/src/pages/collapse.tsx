import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/react'
import { collapseControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'

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

  const [state, send] = useMachine(collapse.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = collapse.connect(state, send, normalizeProps)

  return (
    <>
      <div
        {...api.getRootProps()}
        className="max-w-[600px] my-8 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-200/50"
      >
        {data.map(item => (
          <div
            key={item.title}
            {...api.getItemProps({ value: item.title })}
            className="border-b border-gray-100 last:border-none"
          >
            <h3 className="m-0">
              <button
                {...api.getItemTriggerProps({ value: item.title })}
                className="group w-full px-6 py-5 flex justify-between items-center bg-transparent hover:bg-gray-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-left text-base font-medium text-gray-700 transition-colors">
                    {item.title}
                  </span>
                </div>
                <div
                  className="transition-transform duration-300 i-carbon:chevron-right w-4 h-4 text-gray-400 group-data-[state=open]:rotate-90"
                />
              </button>
            </h3>
            <div
              {...api.getItemContentProps({ value: item.title })}
              className="transition-all duration-300 overflow-hidden max-h-0 opacity-0 data-[state=open]:max-h-[200px] data-[state=open]:opacity-100"
            >
              <div className="px-6 py-4 text-gray-600 bg-gray-50/50">
                <p className="leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
