import { normalizeProps, spread, useMachine } from '@destyler/vanilla'
import * as calendar from '../../index'
import '../style.css'

export function render(target: HTMLElement) {
  const machine = useMachine(
    calendar.machine({
      id: '1',
    }),
  )

  const api = calendar.connect(machine.state, machine.send, normalizeProps)

  target.innerHTML = `
  <div ${spread(api.getControlProps())}>
    <input ${spread(api.getInputProps())} />
    <button ${spread(api.getTriggerProps())}>
      🗓
    </button>
  </div>
  <div ${spread(api.getPositionerProps())}>
    <div ${spread(api.getContentProps())}>
      <!-- Day View -->
      <div ?hidden=${api.view !== 'day'}>
        <div ${spread(api.getViewControlProps({ view: 'year' }))}>
          <button ${spread(api.getPrevTriggerProps())}>
            ←
          </button>
          <button ${spread(api.getViewTriggerProps())}>
            ${api.visibleRangeText.start}
          </button>
          <button ${spread(api.getNextTriggerProps())}>
            →
          </button>
        </div>
    </div>
  </div>
  `
}
