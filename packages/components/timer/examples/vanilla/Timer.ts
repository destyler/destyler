import type { TimerAction, State as TimerState } from '../../src/types'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { normalizeProps, spreadProps, useMachine } from '@destyler/vanilla'
import * as timer from '../../index'
import '../style.css'

const timeParts = ['days', 'hours', 'minutes', 'seconds'] as const
const timerActions: TimerAction[] = ['start', 'pause', 'resume', 'reset']

type TimePart = (typeof timeParts)[number]

type ActionButtons = Record<TimerAction, HTMLButtonElement | null>

type TimeNodes = Record<TimePart, HTMLElement | null>

export function render(target: HTMLElement) {
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="timer">
      <div data-timer-root>
        <div data-timer-area>
          <div data-timer-item="days">00</div>
          <div data-timer-separator>:</div>
          <div data-timer-item="hours">00</div>
          <div data-timer-separator>:</div>
          <div data-timer-item="minutes">00</div>
          <div data-timer-separator>:</div>
          <div data-timer-item="seconds">00</div>
        </div>
      </div>

      <div data-timer-controls>
        <button data-timer-action="start">START</button>
        <button data-timer-action="pause">PAUSE</button>
        <button data-timer-action="resume">RESUME</button>
        <button data-timer-action="reset">RESET</button>
      </div>
    </main>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-timer-root]')
  const areaEl = layout.main.querySelector<HTMLElement>('[data-timer-area]')
  const controlsEl = layout.main.querySelector<HTMLElement>('[data-timer-controls]')
  const separators = Array.from(layout.main.querySelectorAll<HTMLElement>('[data-timer-separator]'))

  const buttons: ActionButtons = {
    start: layout.main.querySelector<HTMLButtonElement>('[data-timer-action="start"]'),
    pause: layout.main.querySelector<HTMLButtonElement>('[data-timer-action="pause"]'),
    resume: layout.main.querySelector<HTMLButtonElement>('[data-timer-action="resume"]'),
    reset: layout.main.querySelector<HTMLButtonElement>('[data-timer-action="reset"]'),
  }

  const items = timeParts.reduce<TimeNodes>((acc, part) => {
    acc[part] = layout.main.querySelector<HTMLElement>(`[data-timer-item="${part}"]`)
    return acc
  }, {} as TimeNodes)

  const machine = useMachine(
    timer.machine({
      id: 'timer:vanilla',
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 2, seconds: 10 }),
      onComplete() {
        // eslint-disable-next-line no-console
        console.log('Timer completed')
      },
    }),
  )

  const toolbar = Toolbar()
  layout.root.appendChild(toolbar.root)

  const applyState = (state: TimerState) => {
    const api = timer.connect(state, machine.send, normalizeProps)

    if (rootEl)
      spreadProps(rootEl, api.getRootProps())
    if (areaEl)
      spreadProps(areaEl, api.getAreaProps())
    if (controlsEl)
      spreadProps(controlsEl, api.getControlProps())

    separators.forEach(separator => spreadProps(separator, api.getSeparatorProps()))

    timeParts.forEach((part) => {
      const node = items[part]
      if (!node)
        return
      spreadProps(node, api.getItemProps({ type: part }))
      node.textContent = api.formattedTime[part]
    })

    timerActions.forEach((action) => {
      const button = buttons[action]
      if (!button)
        return
      spreadProps(button, api.getActionTriggerProps({ action }))
    })

    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  applyState(machine.state as TimerState)
  machine.service.subscribe(state => applyState(state as TimerState))
}
