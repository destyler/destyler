/** @jsxImportSource solid-js */
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import './index.css'

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
      class="collapse-root"
    >
      {data.map(item => (
        <div
          {...api.getItemProps({ value: item.title })}
          class="collapse-item"
        >
          <h3 class="collapse-header">
            <button
              {...api.getItemTriggerProps({ value: item.title })}
              class="collapse-trigger"
            >
              <span>{item.title}</span>
              <div class="collapse-indicator" />
            </button>
          </h3>
          <div
            {...api.getItemContentProps({ value: item.title })}
            class="collapse-content"
          >
            <div class="collapse-content-inner">
              <p class="collapse-text">
                {item.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
