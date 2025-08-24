import { normalizeProps, useMachine } from '@destyler/react'
import * as separator from '@destyler/separator'
import React, { useId } from 'react'

export default function Divider() {
  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id: useId() }))
  
  const api = separator.connect(state, send, normalizeProps)

  return (
    <div className="w-full min-w-90 mx-4">
      <div className="text-primary text-sm font-semibold">
        Destyler UI
      </div>
      <div className="text-primary text-sm mt-0!">
        unstyled component for react.
      </div>
      <div
        {...api.getRootProps()}
        className="bg-stone-300/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
      />
      <div className="flex h-5 items-center mt-0!">
        {items.map((item, index) => (
          <React.Fragment key={item.value}>
            <div className="text-primary text-sm mt-0!">
              {item.label}
            </div>
            {index < items.length - 1 && (
              <div
                {...api.getRootProps('vertical')}
                className="bg-stone-300/50 mt-0! data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
