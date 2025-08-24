import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

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

export default function Collapse({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(collapse.machine({ id: useId() }))
  const api = collapse.connect(state, send, normalizeProps)

  return (
    <div
      {...api.getRootProps()}
      className={`flex flex-col w-full justify-center items-center mt-4! ${className}`}
    >
      {data.map(item => (
        <div
          key={item.title}
          {...api.getItemProps({ value: item.title })}
          className="border-b border-primary/15 w-full mt-0!"
        >
          <h3 className="flex">
            <button
              {...api.getItemTriggerProps({ value: item.title })}
              className="group cursor-pointer text-primary/80 flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline"
            >
              <span>{item.title}</span>
              <div
                className="h-4 w-4 shrink-0 text-accent-foreground transition-transform
                duration-200 i-carbon:chevron-down group-data-[state=open]:rotate--180"
              />
            </button>
          </h3>
          <div
            {...api.getItemContentProps({ value: item.title })}
            className="overflow-hidden text-black dark:text-white text-sm mt-0!"
          >
            <div className="pb-4 pt-0">
              <p className="text-muted-foreground mt-0!">
                {item.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
