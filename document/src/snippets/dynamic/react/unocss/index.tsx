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
      <div {...api.getRootProps()} className="w-md p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {api.value.map((value, index) => (
            <span
              key={index}
              {...api.getItemProps({ index, value })}
              className="relative group"
            >
              <div
                {...api.getItemPreviewProps({ index, value })}
                className="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm border border-px border-input"
              >
                <span className="text-sm font-medium">{value}</span>
                <button
                  {...api.getItemDeleteTriggerProps({ index, value })}
                  className="i-carbon:close inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/50 hover:bg-primary transition-colors text-xs"
                />
              </div>
              <input
                {...api.getItemInputProps({ index, value })}
                className="hidden absolute left-0 top-0 w-full px-2 py-1.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
              />
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            placeholder="Add Tag..."
            {...api.getInputProps()}
            className="w-full px-4 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-primary outline-none bg-background text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>
    </>
  )
}
