import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const cleanups: VoidFunction[] = []

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})

function setup(context: Partial<UserDefinedContext> = {}, values = ['a', 'b'], indicator = true) {
  const service = machine({ id: 'indicator-routing', defaultValue: 'a', ...context })
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const list = document.createElement('div')
  list.id = api().getListProps().id!
  root.append(list)
  const triggers = values.map((value, index) => {
    const trigger = document.createElement('button')
    trigger.id = api().getTriggerProps({ value }).id!
    trigger.setAttribute('role', 'tab')
    trigger.setAttribute('data-ownedby', list.id)
    // A deterministic geometry fixture. Native CSS layout is covered separately.
    Object.defineProperties(trigger, {
      offsetLeft: { value: index * 40 },
      offsetTop: { value: index * 10 },
      offsetWidth: { value: 20 + index * 35 },
      offsetHeight: { value: 12 + index * 6 },
    })
    list.append(trigger)
    return trigger
  })
  if (indicator) {
    const element = document.createElement('div')
    element.id = api().getIndicatorProps().id!
    root.append(element)
  }
  document.body.append(root)
  cleanups.push(() => root.remove(), () => service.stop())
  service.start()
  return { service, api, triggers }
}

describe('tabs indicator logical value routing', () => {
  it('queries and measures the requested trigger without double-prefixing its id', () => {
    const { api, triggers } = setup()
    const query = vi.spyOn(document, 'getElementById')
    api().setIndicatorRect('b')
    expect(query).toHaveBeenCalledWith(triggers[1].id)
    expect(query).not.toHaveBeenCalledWith(`tabs:indicator-routing:trigger-${triggers[1].id}`)
    expect(api().getIndicatorProps().style).toMatchObject({ '--left': '40px', '--top': '10px', '--width': '55px', '--height': '18px' })
  })

  it('preserves a logical value that itself looks like a DOM id', () => {
    const value = 'tabs:indicator-routing:trigger-special'
    const { api, triggers } = setup({}, ['a', value])
    const query = vi.spyOn(document, 'getElementById')
    api().setIndicatorRect(value)
    expect(query).toHaveBeenCalledWith(triggers[1].id)
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '55px' })
  })

  it('uses the supported fixed custom trigger, list, and indicator ids', () => {
    const { api, triggers } = setup({ ids: { trigger: 'custom-trigger', list: 'custom-list', indicator: 'custom-indicator' } }, ['a'])
    const query = vi.spyOn(document, 'getElementById')
    api().setIndicatorRect('a')
    expect(query).toHaveBeenCalledWith(triggers[0].id)
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '20px', '--height': '12px' })
  })

  it('does not select or propose selection of the measured controlled tab', () => {
    const onValueChange = vi.fn()
    const { api, service } = setup({ value: 'a', onValueChange })
    api().setIndicatorRect('b')
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '55px' })
    expect(api().value).toBe('a')
    expect(api().focusedValue).toBe('a')
    expect(onValueChange).not.toHaveBeenCalled()
    service.setContext({ value: 'b' })
    expect(api().value).toBe('b')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('keeps the prior rectangle when the requested trigger is missing', () => {
    const { api, service } = setup()
    service.send({ type: 'SET_INDICATOR_RECT' })
    const before = api().getIndicatorProps().style
    api().setIndicatorRect('missing')
    expect(api().getIndicatorProps().style).toEqual(before)
  })

  it('does not measure when no indicator is rendered', () => {
    const { api } = setup({}, ['a', 'b'], false)
    const query = vi.spyOn(document, 'getElementById')
    api().setIndicatorRect('b')
    expect(query).not.toHaveBeenCalled()
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '0px', '--height': '0px' })
  })
})
