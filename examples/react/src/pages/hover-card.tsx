import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/react'
import { hoverCardControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'

export default function HoverCard() {
  const controls = useControls(hoverCardControls)

  const [state, send] = useMachine(hoverCard.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = hoverCard.connect(state, send, normalizeProps)

  return (
    <div className="mt-10">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api.getTriggerProps()}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 transition-colors duration-200"
      >
        Twitter
      </a>
      <div {...api.getPositionerProps()}>
        <div
          {...api.getContentProps()}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-sm mt-2 border border-gray-200 dark:border-gray-800 transition-all duration-200 transform"
        >
          <div className="flex items-center space-x-4">
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
              className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">elonehoo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Frontend Developer</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            Follow me on Twitter for web development tips and updates!
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 i-carbon:logo-x" />
            @elonehoo
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
