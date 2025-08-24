/** @jsxImportSource solid-js */
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createUniqueId } from 'solid-js'

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

export default function Collapse() {
  const [state, send] = useMachine(collapse.machine({ id: createUniqueId() }))
  const api = collapse.connect(state, send, normalizeProps)

  return (
    <div
      {...api.getRootProps()}
      class="flex flex-col w-full justify-center items-center mt-4"
    >
      {data.map(item => (
        <div
          {...api.getItemProps({ value: item.title })}
          class="border-b border-primary/15 w-full mt-0"
        >
          <h3 class="flex">
            <button
              {...api.getItemTriggerProps({ value: item.title })}
              class="group cursor-pointer text-primary/80 flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline"
            >
              <span>{item.title}</span>
              <div
                class="h-4 w-4 shrink-0 text-accent-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                style={{
                  "background-image": 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'><path fill=\'currentColor\' d=\'M16 22L6 12l1.4-1.4 8.6 8.6 8.6-8.6L26 12z\'/></svg>")',
                  "background-size": 'contain',
                  "background-repeat": 'no-repeat'
                }}
              />
            </button>
          </h3>
          <div
            {...api.getItemContentProps({ value: item.title })}
            class="overflow-hidden text-black dark:text-white text-sm mt-0"
          >
            <div class="pb-4 pt-0">
              <p class="text-muted-foreground mt-0">
                {item.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
