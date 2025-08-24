import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function DynamicPage() {
  const [state, send] = useMachine(
    dynamic.machine({
      id: useId(),
      value: ['React', 'Vue'],
    }),
  )

  const api = dynamic.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="dynamic-root">
        <div className="dynamic-tag-container">
          {api.value.map((value, index) => (
            <span
              key={index}
              {...api.getItemProps({ index, value })}
              className="dynamic-tag-item"
            >
              <div
                {...api.getItemPreviewProps({ index, value })}
                className="dynamic-tag-preview"
              >
                <span className="dynamic-tag-name">{value}</span>
                <button
                  {...api.getItemDeleteTriggerProps({ index, value })}
                  className="dynamic-delete-button"
                />
              </div>
              <input
                {...api.getItemInputProps({ index, value })}
                className="dynamic-tag-input"
              />
            </span>
          ))}
        </div>
        <div className="dynamic-input-container">
          <input
            placeholder="Add Tag..."
            {...api.getInputProps()}
            className="dynamic-input"
          />
        </div>
      </div>
    </>
  )
}
