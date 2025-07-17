import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/react'
import { collapseControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/collapse.css'

export default function CollapsePage() {
  const controls = useControls(collapseControls)

  const data = [
    {
      id: 'watercraft',
      title: 'Watercraft',
      content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
    },
    {
      id: 'automobiles',
      title: 'Automobiles',
      content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
    },
    {
      id: 'aircraft',
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
        className="collapse-root"
      >
        {data.map(item => (
          <div
            key={item.title}

            {...api.getItemProps({ value: item.title })}
            className="collapse-item"
          >
            <h3 style={{ margin: 0 }}>
              <button
                data-testid={`${item.id}:trigger`}
                {...api.getItemTriggerProps({ value: item.title })}
                className="group collapse-item-trigger"
              >
                <div className="collapse-item-trigger-title">
                  <span className="collapse-item-trigger-title-text">
                    {item.title}
                  </span>
                </div>
                <div
                  className="collapse-item-trigger-icon"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" /></svg>
                </div>
              </button>
            </h3>
            <div
              data-testid={`${item.id}:content`}
              {...api.getItemContentProps({ value: item.title })}
              className="collapse-item-content"
            >
              <div className="collapse-item-content-box">
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
