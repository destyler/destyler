import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Timer'

type TimePart = 'days' | 'hours' | 'minutes' | 'seconds'
type TimerAction = 'start' | 'pause' | 'resume' | 'reset'

let mount: HTMLElement | null = null

const START_VALUES: Record<TimePart, string> = {
  days: '02',
  hours: '00',
  minutes: '00',
  seconds: '10',
}

const SECOND_DELAY = 1100
const TIME_PARTS: TimePart[] = ['days', 'hours', 'minutes', 'seconds']

function timerArea() {
  return page.getByArticle(testHook.part('area'))
}

function timerItem(part: TimePart) {
  return page.getByArticle(`${testHook.part('item')}[data-type="${part}"]`)
}

function actionTrigger(action: TimerAction) {
  return page.getByArticle(`${testHook.part('action-trigger')}[data-timer-action="${action}"]`)
}

async function waitForNextSecond(count = 1) {
  for (let i = 0; i < count; i++) {
    await new Promise(resolve => setTimeout(resolve, SECOND_DELAY))
  }
}

describe('[timer] browser tests', () => {
  beforeEach(async () => {
    if (mount) {
      mount.remove()
    }

    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('renders countdown segments and area metadata', async () => {
    await expect.element(timerArea()).toHaveAttribute('role', 'timer')
    await expect.element(timerArea()).toHaveAttribute('aria-atomic', 'true')
    await expect.element(timerArea()).toHaveAttribute('aria-label', '2 days 00:00:10')

    for (const part of TIME_PARTS) {
      await expect.element(timerItem(part)).toHaveTextContent(START_VALUES[part])
    }

    await expect.element(actionTrigger('start')).toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('pause')).not.toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('resume')).toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('reset')).not.toHaveAttribute('hidden', '')
  })

  it('auto starts countdown and updates aria label as seconds elapse', async () => {
    await expect.element(timerItem('seconds')).toHaveTextContent('10')

    await waitForNextSecond()

    await expect.element(timerItem('seconds')).toHaveTextContent('09')
    await expect.element(timerArea()).toHaveAttribute('aria-label', '2 days 00:00:09')
  })

  it('pause halts countdown until resume continues ticking', async () => {
    await waitForNextSecond()
    await expect.element(timerItem('seconds')).toHaveTextContent('09')

    await userEvent.click(actionTrigger('pause'))
    await expect.element(actionTrigger('resume')).not.toHaveAttribute('hidden', '')

    await waitForNextSecond()
    await expect.element(timerItem('seconds')).toHaveTextContent('09')

    await userEvent.click(actionTrigger('resume'))
    await waitForNextSecond()
    await expect.element(timerItem('seconds')).toHaveTextContent('08')
  })

  it('reset while paused restores the start value and returns to idle controls', async () => {
    await userEvent.click(actionTrigger('pause'))
    await userEvent.click(actionTrigger('reset'))

    await expect.element(timerItem('days')).toHaveTextContent(START_VALUES.days)
    await expect.element(timerItem('hours')).toHaveTextContent(START_VALUES.hours)
    await expect.element(timerItem('minutes')).toHaveTextContent(START_VALUES.minutes)
    await expect.element(timerItem('seconds')).toHaveTextContent(START_VALUES.seconds)

    await expect.element(actionTrigger('start')).not.toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('pause')).toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('resume')).toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('reset')).toHaveAttribute('hidden', '')
  })

  it('start restarts the timer after resetting to idle', async () => {
    await userEvent.click(actionTrigger('pause'))
    await userEvent.click(actionTrigger('reset'))

    await userEvent.click(actionTrigger('start'))
    await waitForNextSecond()

    await expect.element(timerItem('seconds')).toHaveTextContent('09')
    await expect.element(actionTrigger('start')).toHaveAttribute('hidden', '')
    await expect.element(actionTrigger('pause')).not.toHaveAttribute('hidden', '')
  })
})
