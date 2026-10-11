import type { Context } from '../components/progress/index'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine, splitProps } from '../components/progress/index'
import { createNormalizer } from '../types/index'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
})

function setup(context: Partial<Context> = {}) {
  const service = machine({ id: 'progress-contract', ...context })
  services.push(service)
  service._created()
  service.start()
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

function expectValue(fixture: ReturnType<typeof setup>, value: number, percent: number) {
  const api = fixture.api()
  expect(api.value).toBe(value)
  expect(api.percent).toBe(percent)
  expect(api.percentAsString).toBe(`${percent}%`)
  expect(api.getTrackProps()).toMatchObject({ 'aria-valuemin': api.min, 'aria-valuemax': api.max, 'aria-valuenow': value })
  expect(api.getCircleProps()).toMatchObject({ 'aria-valuemin': api.min, 'aria-valuemax': api.max, 'aria-valuenow': value })
  expect(api.getRootProps()).toMatchObject({ 'data-value': value, 'style': { '--percent': percent } })
  expect(api.getRangeProps().style).toEqual({ width: `${percent}%` })
}

describe('Progress value bounds contracts', () => {
  it.each([
    { min: 20, max: 100, value: 50, input: 10, expected: 20, percent: 0 },
    { min: 20, max: 100, value: 50, input: -100, expected: 20, percent: 0 },
    { min: -100, max: 100, value: 50, input: -50, expected: -50, percent: 25 },
    { min: -100, max: -20, value: -50, input: -70, expected: -70, percent: 38 },
    { min: -100, max: -20, value: -50, input: -200, expected: -100, percent: 0 },
    { min: -100, max: -20, value: -50, input: 0, expected: -20, percent: 100 },
    { min: 0, max: 100, value: 50, input: -10, expected: 0, percent: 0 },
    { min: 0, max: 100, value: 50, input: 120, expected: 100, percent: 100 },
    { min: 0.25, max: 1.25, value: 0.75, input: 0.1, expected: 0.25, percent: 0 },
  ])('clamps a requested value to its declared bounds: %j', ({ input, expected, percent, ...context }) => {
    const onValueChange = vi.fn()
    const fixture = setup({ ...context, onValueChange })
    fixture.api().setValue(input)
    expectValue(fixture, expected, percent)
    // Notification payload remains the requested value, as before the bounds repair.
    expect(onValueChange).toHaveBeenLastCalledWith({ value: input })
  })

  it('sets negative minima and maxima exactly through the public helpers', () => {
    const fixture = setup({ min: -100, max: -20, value: -50 })
    fixture.api().setToMin()
    expectValue(fixture, -100, 0)
    fixture.api().setToMax()
    expectValue(fixture, -20, 100)
    expect(fixture.api().getRootProps()['data-state']).toBe('complete')
  })

  it('uses the midpoint of custom bounds when no initial value is supplied', () => {
    expectValue(setup({ min: -100, max: -20 }), -60, 50)
    expectValue(setup(), 50, 50)
  })

  it('keeps the established requested-value equality and notification order', () => {
    const observed: Array<{ value: number | null, current: number | null }> = []
    const fixture: ReturnType<typeof setup> = setup({ value: 50, onValueChange: ({ value }) => observed.push({ value, current: fixture.api().value }) })
    fixture.api().setValue(50)
    expect(observed).toEqual([])
    fixture.api().setValue(120)
    fixture.api().setValue(120)
    fixture.api().setValue(100)
    expect(observed).toEqual([{ value: 120, current: 100 }, { value: 120, current: 100 }])
  })

  it('preserves indeterminate state and allows returning to a negative determinate range', () => {
    const onValueChange = vi.fn()
    const fixture = setup({ min: -100, max: -20, value: -50, onValueChange })
    fixture.api().setValue(null)
    fixture.api().setValue(null)
    expect(fixture.api().indeterminate).toBe(true)
    expect(fixture.api().percent).toBe(-1)
    expect(fixture.api().percentAsString).toBe('')
    expect(fixture.api().valueAsString).toBe('loading...')
    expect(fixture.api().getTrackProps()['aria-valuenow']).toBeUndefined()
    expect(fixture.api().getRangeProps().style).toEqual({ width: undefined })
    expect(fixture.api().getCircleRangeProps().style.strokeDasharray).toBeUndefined()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: null })
    fixture.api().setValue(-60)
    expectValue(fixture, -60, 50)
    expect(fixture.api().indeterminate).toBe(false)
    expect(fixture.api().getCircleRangeProps().style.strokeDasharray).toBe('var(--circumference)')
  })

  it('uses an updated minimum for later public actions without echoing parent updates', () => {
    const onValueChange = vi.fn()
    const fixture = setup({ value: 50, onValueChange })
    fixture.service.setContext({ min: 20, max: 80, value: 50 })
    expect(onValueChange).not.toHaveBeenCalled()
    fixture.api().setValue(0)
    expectValue(fixture, 20, 0)
  })

  it('passes updated values and bounds to localized messages', () => {
    const valueText = vi.fn(({ value, min, max, percent }) => `${value}/${min}/${max}/${percent}`)
    const fixture = setup({ min: 20, max: 100, value: 50, translations: { value: valueText } })
    fixture.api().setToMin()
    expect(fixture.api().valueAsString).toBe('20/20/100/0')
    expect(valueText).toHaveBeenLastCalledWith({ value: 20, min: 20, max: 100, percent: 0 })
  })

  it('preserves vertical direction, state views, anatomy and custom IDs', () => {
    const fixture = setup({ orientation: 'vertical', dir: 'rtl', ids: { root: 'p-root', label: 'p-label', track: 'p-track', circle: 'p-circle' } })
    expect(fixture.api().getRootProps()).toMatchObject({ 'id': 'p-root', 'dir': 'rtl', 'data-orientation': 'vertical', 'data-part': 'root' })
    expect(fixture.api().getLabelProps()).toMatchObject({ id: 'p-label', dir: 'rtl' })
    expect(fixture.api().getTrackProps().id).toBe('p-track')
    expect(fixture.api().getCircleProps().id).toBe('p-circle')
    expect(fixture.api().getRangeProps().style).toEqual({ height: '50%' })
    expect(fixture.api().getCircleTrackProps()).toMatchObject({ 'data-part': 'circle-track', 'style': { r: 'var(--radius)', fill: 'transparent' } })
    expect(fixture.api().getValueTextProps()).toMatchObject({ 'aria-live': 'polite', 'data-part': 'value-text' })
    expect(fixture.api().getViewProps({ state: 'loading' }).hidden).toBe(false)
    expect(fixture.api().getViewProps({ state: 'complete' }).hidden).toBe(true)
    fixture.api().setToMax()
    expect(fixture.api().getViewProps({ state: 'loading' }).hidden).toBe(true)
    expect(fixture.api().getViewProps({ state: 'complete' }).hidden).toBe(false)
    fixture.api().setValue(null)
    expect(fixture.api().getViewProps({ state: 'indeterminate' }).hidden).toBe(false)
  })

  it('splits public context props without consuming unrelated element attributes', () => {
    const onValueChange = vi.fn()
    const context = { id: 'split-progress', value: null, min: 20, max: 100, onValueChange }
    const [props, rest] = splitProps({ ...context, className: 'progress' })
    expect(props).toEqual(context)
    expect(rest).toEqual({ className: 'progress' })
  })

  it.each([
    { value: 101, max: 100 },
    { value: -1, min: 0 },
    { value: Number.NaN },
    { max: Number.NaN },
  ])('continues rejecting invalid initial determinate values: %j', (context) => {
    expect(() => setup(context)).toThrow('[progress]')
  })
})
