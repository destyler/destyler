import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/react'
import { dynamicControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'

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

  return (
    <>
      <div {...api.getRootProps()} className="max-w-md p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {api.value.map((value, index) => (
            <span
              key={index}
              {...api.getItemProps({ index, value })}
              className="relative group"
            >
              <div
                {...api.getItemPreviewProps({ index, value })}
                className="bg-gray-100 text-gray-900 rounded-lg px-3 py-1 flex items-center gap-2"
              >
                <span className="text-sm font-medium">{value}</span>
                <button
                  {...api.getItemDeleteTriggerProps({ index, value })}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-xs"
                >
                  &#x2715;
                </button>
              </div>
              <input
                {...api.getItemInputProps({ index, value })}
                className="hidden absolute left-0 top-0 w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
              />
            </span>
          ))}
        </div>
        <input
          placeholder="Add tag..."
          {...api.getInputProps()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none placeholder-gray-500"
        />
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
