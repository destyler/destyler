import * as hoverCard from '@destyler/hover-card'
import { hoverCardControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function HoverCard() {
  const controls = useControls(hoverCardControls)
  const id = createUniqueId()

  const [state, send] = useMachine(hoverCard.machine({ id }), {
    context: controls.context,
  })

  const api = createMemo(() => hoverCard.connect(state, send, normalizeProps))

  return (
    <div class="mt-10">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api().getTriggerProps()}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 transition-colors duration-200"
      >
        Twitter
      </a>
      <div {...api().getPositionerProps()}>
        <div
          {...api().getContentProps()}
          class="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-sm mt-2 border border-gray-200 dark:border-gray-800 transition-all duration-200 transform"
        >
          <div class="flex items-center space-x-4">
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
              class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
            />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">elonehoo</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Frontend Developer</p>
            </div>
          </div>
          <div class="mt-3 text-sm text-gray-700 dark:text-gray-300">
            Follow me on Twitter for web development tips and updates!
          </div>
          <div class="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div class="w-4 h-4 i-carbon:logo-x" />
            @elonehoo
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
