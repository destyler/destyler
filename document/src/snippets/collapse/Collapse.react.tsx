import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '../../styles/components/collapse.css'

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
      className={`${className}`}
    >
      {data.map(item => (
        <div key={item.title} {...api.getItemProps({ value: item.title })}>
          <h3>
            <button {...api.getItemTriggerProps({ value: item.title })}>
              <span>{item.title}</span>
              <div />
            </button>
          </h3>
          <div {...api.getItemContentProps({ value: item.title })}>
            <div>
              <p>
                {item.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
