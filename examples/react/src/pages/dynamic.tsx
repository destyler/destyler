import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/react'
import { dynamicControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'

import '@destyler/shared-private/styles/dynamic.css'

export default function DynamicPage() {
  const controls = useControls(dynamicControls)

  const [state, send] = useMachine(
    dynamic.machine({
      id: useId(),
      value: ['React', 'Vue'],
    }),
    {
      context: controls.context,
    },
  )

  const api = dynamic.connect(state, send, normalizeProps)

  function toDashCase(str: string) {
    return str.replace(/\s+/g, '-').toLowerCase()
  }

  return (
    <>
      <input data-testid="copy-text" />
      <div {...api.getRootProps()} className="dynamic-root">
        <div className="dynamic-content">
          {api.value.map((value, index) => (
            <span
              key={index}
              {...api.getItemProps({ index, value })}
              className="group"
              style={{ position: 'relative' }}
            >
              <div
                data-testid={`${toDashCase(value)}-input`}
                {...api.getItemPreviewProps({ index, value })}
                className="dynamic-item-preview"
              >
                <span className="dynamic-item-preview-value">{value}</span>
                <button
                  {...api.getItemDeleteTriggerProps({ index, value })}
                  className="dynamic-item-delete-trigger"
                  data-testid={`${toDashCase(value)}-delete-trigger`}
                >
                  &#x2715;
                </button>
              </div>
              <input
                {...api.getItemInputProps({ index, value })}
                data-testid={`${toDashCase(value)}-item-input`}
              />
            </span>
          ))}
        </div>
        <input
          placeholder="Add tag..."
          {...api.getInputProps()}
          className="dynamic-input"
        />
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
