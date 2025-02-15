import { normalizeProps, useMachine } from '@destyler/react'
import * as separator from '@destyler/separator'
import React, { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'

export default function Divider() {
  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id: useId() }))
  const api = separator.connect(state, send, normalizeProps)

  return (
    <div className="w-full max-w-75 mx-4">
      <div className="text-black text-sm font-semibold">
        Destyler UI
      </div>
      <div className="text-black text-sm">
        unstyled component for vue.
      </div>
      <div
        {...api.getRootProps()}
        className="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
      />
      <div className="flex h-5 items-center">
        {items.map((item, index) => (
          <React.Fragment key={item.value}>
            <div className="text-black text-sm">
              {item.label}
            </div>
            {index < items.length - 1 && (
              <div
                {...api.getRootProps('vertical')}
                className="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
