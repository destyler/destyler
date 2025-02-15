import { normalizeProps, useMachine } from '@destyler/solid'
import * as timer from '@destyler/timer'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'

export default function Timer() {
  const [state, send] = useMachine(
    timer.machine({
      id: createUniqueId(),
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 20, seconds: 1 }),
    }),
  )

  const api = createMemo(() => timer.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="min-h-screen flex flex-col items-center justify-center p-8">
      <div {...api().getAreaProps()} class="flex space-x-2 mb-8 p-6 bg-white rounded-xl shadow-lg">
        <div {...api().getItemProps({ type: 'days' })} class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
          {api().formattedTime.days}
        </div>
        <div {...api().getSeparatorProps()} class="text-4xl font-mono text-gray-600">:</div>
        <div {...api().getItemProps({ type: 'hours' })} class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
          {api().formattedTime.hours}
        </div>
        <div {...api().getSeparatorProps()} class="text-4xl font-mono text-gray-600">:</div>
        <div {...api().getItemProps({ type: 'minutes' })} class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
          {api().formattedTime.minutes}
        </div>
        <div {...api().getSeparatorProps()} class="text-4xl font-mono text-gray-600">:</div>
        <div {...api().getItemProps({ type: 'seconds' })} class="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
          {api().formattedTime.seconds}
        </div>
      </div>

      <div {...api().getControlProps()} class="flex gap-4">
        <button
          {...api().getActionTriggerProps({ action: 'start' })}
          class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          START
        </button>
        <button
          {...api().getActionTriggerProps({ action: 'pause' })}
          class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          PAUSE
        </button>
        <button
          {...api().getActionTriggerProps({ action: 'resume' })}
          class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          RESUME
        </button>
        <button
          {...api().getActionTriggerProps({ action: 'reset' })}
          class="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          RESET
        </button>
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
