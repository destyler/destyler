import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '@docs/styles/components/dynamic.css'

export default function DynamicPage() {
  const [state, send] = useMachine(
    dynamic.machine({
      id: useId(),
      value: ['React', 'Destyler'],
    }),
  )

  const api = dynamic.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        <div className="flex flex-wrap gap-2 mb-4">
          {api.value.map((value, index) => (
            <span
              key={index}
              {...api.getItemProps({ index, value })}
            >
              <div {...api.getItemPreviewProps({ index, value })}>
                <span>{value}</span>
                <button {...api.getItemDeleteTriggerProps({ index, value })} />
              </div>
              <input {...api.getItemInputProps({ index, value })} />
            </span>
          ))}
        </div>
        <div className="relative">
          <input placeholder="Add Tag..." {...api.getInputProps()} />
        </div>
      </div>
    </>
  )
}
