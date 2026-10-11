import type { Context, TimerAction } from '../components/timer/index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect, machine, splitProps } from '../components/timer/index'
import { createNormalizer } from '../types/index'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

beforeEach(() => vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] }))
afterEach(() => {
  try {
    for (const service of services.splice(0))
      service.stop()
    expect(vi.getTimerCount()).toBe(0)
  }
  finally {
    vi.clearAllTimers()
    vi.useRealTimers()
  }
})

function setup(context: Partial<Context> = {}) {
  const service = machine({ id: 'timer-contract', interval: 250, ...context })
  services.push(service)
  service.start()
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

function visibleActions(fixture: ReturnType<typeof setup>) {
  const actions: TimerAction[] = ['start', 'pause', 'resume', 'reset']
  return actions.filter(action => !fixture.api().getActionTriggerProps({ action }).hidden)
}

describe('Timer lifecycle contracts', () => {
  it('uses the documented default interval when omitted', () => {
    const onTick = vi.fn()
    const fixture = setup({ autoStart: true, interval: undefined, onTick })
    vi.advanceTimersByTime(249)
    expect(onTick).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onTick).toHaveBeenLastCalledWith(expect.objectContaining({ value: 250 }))
    expect(fixture.service.getState().context.interval).toBe(250)
  })

  it('stays idle until started and owns one interval through repeated starts', () => {
    const onTick = vi.fn()
    const fixture = setup({ onTick })
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(1000)
    expect(onTick).not.toHaveBeenCalled()
    expect(fixture.api().time.milliseconds).toBe(0)
    expect(visibleActions(fixture)).toEqual(['start'])
    fixture.api().start()
    fixture.api().start()
    expect(vi.getTimerCount()).toBe(1)
    expect(visibleActions(fixture)).toEqual(['pause', 'reset'])
    vi.advanceTimersByTime(750)
    expect(onTick.mock.calls.map(([details]) => details.value)).toEqual([250, 500, 750])
  })

  it('auto starts and exposes a consistent tick snapshot across day rollover', () => {
    const onTick = vi.fn()
    const fixture = setup({ autoStart: true, startMs: 86_399_750, onTick })
    expect(fixture.api().running).toBe(true)
    expect(fixture.api().formattedTime).toEqual({ days: '00', hours: '23', minutes: '59', seconds: '59', milliseconds: '750' })
    vi.advanceTimersByTime(250)
    expect(onTick).toHaveBeenLastCalledWith({
      value: 86_400_000,
      time: { days: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
      formattedTime: { days: '01', hours: '00', minutes: '00', seconds: '00', milliseconds: '0' },
    })
    expect(fixture.api().getAreaProps()['aria-label']).toBe('1 days 00:00:00')
  })

  it('pauses without ticking and resumes only one interval after repeated resume requests', () => {
    const onTick = vi.fn()
    const fixture = setup({ autoStart: true, countdown: true, startMs: 2000, onTick })
    vi.advanceTimersByTime(250)
    fixture.api().pause()
    fixture.api().pause()
    expect(vi.getTimerCount()).toBe(0)
    expect(fixture.api().paused).toBe(true)
    expect(visibleActions(fixture)).toEqual(['resume', 'reset'])
    vi.advanceTimersByTime(5000)
    expect(onTick).toHaveBeenCalledTimes(1)
    expect(fixture.service.getState().context.currentMs).toBe(1750)
    fixture.api().resume()
    fixture.api().resume()
    expect(vi.getTimerCount()).toBe(1)
    vi.advanceTimersByTime(250)
    expect(onTick.mock.calls.map(([details]) => details.value)).toEqual([1750, 1500])
  })

  it('reset preserves running state but returns a paused timer to idle without a tick callback', () => {
    const onTick = vi.fn()
    const fixture = setup({ autoStart: true, startMs: 1000, onTick })
    vi.advanceTimersByTime(250)
    fixture.api().reset()
    expect(fixture.api().running).toBe(true)
    expect(fixture.service.getState().context.currentMs).toBe(1000)
    expect(onTick).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(1)
    fixture.api().pause()
    fixture.api().reset()
    expect(fixture.api().running).toBe(false)
    expect(fixture.api().paused).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
    expect(onTick).toHaveBeenCalledTimes(1)
    fixture.api().reset()
    expect(fixture.service.getState().context.currentMs).toBe(1000)
  })

  it.each(['idle', 'running', 'paused'] as const)('restart resets from %s and owns exactly one new interval', (state) => {
    const fixture = setup({ startMs: 1000 })
    if (state !== 'idle') {
      fixture.api().start()
      vi.advanceTimersByTime(350)
    }
    if (state === 'paused')
      fixture.api().pause()
    fixture.api().restart()
    expect(fixture.api().running).toBe(true)
    expect(fixture.service.getState().context.currentMs).toBe(1000)
    expect(vi.getTimerCount()).toBe(1)
    vi.advanceTimersByTime(249)
    expect(fixture.service.getState().context.currentMs).toBe(1000)
    vi.advanceTimersByTime(1)
    expect(fixture.service.getState().context.currentMs).toBe(1250)
  })

  it('releases its owned interval and suppresses callbacks when the owner stops', () => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const fixture = setup({ autoStart: true, targetMs: 500, onTick, onComplete })
    vi.advanceTimersByTime(250)
    fixture.service.stop()
    fixture.service.stop()
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(5000)
    expect(onTick).toHaveBeenCalledTimes(1)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it.each([
    { countdown: false, startMs: 0, targetMs: 500, values: [250, 500] },
    { countdown: true, startMs: 500, targetMs: 0, values: [250, 0] },
    { countdown: true, startMs: 500, values: [250, 0] },
  ])('completes an aligned target once and releases its interval: %j', (context) => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const fixture = setup({ ...context, autoStart: true, onTick, onComplete })
    vi.advanceTimersByTime(1000)
    expect(onTick.mock.calls.map(([details]) => details.value)).toEqual(context.values)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(fixture.api().running).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(1000)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('keeps the stopwatch running without a target and reports bounded-target progress', () => {
    const stopwatch = setup({ autoStart: true })
    vi.advanceTimersByTime(1000)
    expect(stopwatch.api().running).toBe(true)
    expect(stopwatch.api().progressPercent).toBe(0)
    const target = setup({ autoStart: true, startMs: 1000, targetMs: 2000 })
    vi.advanceTimersByTime(500)
    expect(target.api().progressPercent).toBe(0.5)
  })

  it('splits all public timer options without consuming unrelated element props', () => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const context = { id: 'split-timer', ids: { area: 'split-area' }, interval: 100, countdown: true, autoStart: true, startMs: 500, targetMs: 0, onTick, onComplete }
    const [timerProps, elementProps] = splitProps({ ...context, className: 'timer' })
    expect(timerProps).toEqual(context)
    expect(elementProps).toEqual({ className: 'timer' })
  })

  it('rejects unsupported trigger actions while preserving default IDs', () => {
    const fixture = setup()
    expect(fixture.api().getRootProps().id).toBe('timer:timer-contract:root')
    expect(fixture.api().getAreaProps().id).toBe('timer:timer-contract:area')
    expect(() => Reflect.apply(fixture.api().getActionTriggerProps, undefined, [{ action: 'restart' }])).toThrow('Invalid action: restart')
  })

  it('preserves custom IDs, anatomy, value styles, and action cancellation', () => {
    const fixture = setup({ ids: { root: 'custom-root', area: 'custom-area' }, startMs: 1250 })
    expect(fixture.api().getRootProps()).toMatchObject({ 'id': 'custom-root', 'data-scope': 'timer', 'data-part': 'root' })
    expect(fixture.api().getAreaProps()).toMatchObject({ 'id': 'custom-area', 'role': 'timer', 'aria-atomic': true })
    expect(fixture.api().getControlProps()).toMatchObject({ 'data-part': 'control' })
    expect(fixture.api().getItemProps({ type: 'milliseconds' })).toMatchObject({ 'data-type': 'milliseconds', 'style': { '--value': 250 } })
    expect(fixture.api().getItemLabelProps({ type: 'seconds' })).toMatchObject({ 'data-part': 'item-label', 'data-type': 'seconds' })
    expect(fixture.api().getItemValueProps({ type: 'seconds' })).toMatchObject({ 'data-part': 'item-value', 'data-type': 'seconds' })
    expect(fixture.api().getSeparatorProps()).toMatchObject({ 'aria-hidden': true })
    const trigger = fixture.api().getActionTriggerProps({ action: 'start' })
    expect(trigger.type).toBe('button')
    trigger.onClick({ defaultPrevented: true })
    expect(fixture.api().running).toBe(false)
    trigger.onClick({ defaultPrevented: false })
    expect(fixture.api().running).toBe(true)
  })
})
