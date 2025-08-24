import { normalizeProps, useMachine } from '@destyler/react'
import * as separator from '@destyler/separator'
import React, { useId } from 'react'
import './index.css'

export default function Divider() {
  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id: useId() }))
  const api = separator.connect(state, send, normalizeProps)

  return (
    <div className="container">
      <div className="title">
        Destyler UI
      </div>
      <div className="subtitle">
        unstyled component for react.
      </div>
      <div
        {...api.getRootProps()}
        className="separator-horizontal"
      />
      <div className="items-row">
        {items.map((item, index) => (
          <React.Fragment key={item.value}>
            <div className="item-label">
              {item.label}
            </div>
            {index < items.length - 1 && (
              <div
                {...api.getRootProps('vertical')}
                className="separator-vertical"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
