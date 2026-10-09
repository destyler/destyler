import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

function setup(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'indicator-layout', defaultValue: 'a', ...context })
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const list = document.createElement('div')
  list.id = api().getListProps().id!
  list.style.cssText = 'position: relative; width: 300px; height: 100px'
  const values = context.ids?.trigger ? ['a'] : ['a', 'b']
  const triggers = values.map((value, index) => {
    const trigger = document.createElement('button')
    trigger.id = api().getTriggerProps({ value }).id!
    trigger.setAttribute('role', 'tab')
    trigger.setAttribute('data-ownedby', list.id)
    trigger.style.cssText = `position: absolute; box-sizing: border-box; padding: 0; border: 0; left: ${index * 70}px; top: 11px; width: ${40 + index * 25}px; height: 23px`
    list.append(trigger)
    return trigger
  })
  const indicator = document.createElement('div')
  indicator.id = api().getIndicatorProps().id!
  root.append(list, indicator)
  document.body.append(root)
  cleanups.push(() => root.remove(), () => service.stop())
  service.start()
  return { api, triggers }
}

describe('tabs indicator real CSS layout', () => {
  it('measures the requested unselected tab in native layout', () => {
    const { api, triggers } = setup()
    expect(triggers[1].offsetWidth).toBe(65)
    api().setIndicatorRect('b')
    expect(api().getIndicatorProps().style).toMatchObject({ '--left': '70px', '--top': '11px', '--width': '65px', '--height': '23px' })
    expect(api().value).toBe('a')
  })

  it('preserves vertical controlled selection while measuring another tab', () => {
    const { api, triggers } = setup({ orientation: 'vertical', value: 'a' })
    expect(triggers[1].offsetWidth).toBe(65)
    api().setIndicatorRect('b')
    expect(api().getIndicatorProps().style).toMatchObject({ '--top': '11px', '--height': '23px', 'top': 'var(--top)' })
    expect(api().value).toBe('a')
  })

  it('resolves custom ids to native geometry', () => {
    const { api, triggers } = setup({ ids: { trigger: 'layout-trigger', list: 'layout-list', indicator: 'layout-indicator' } })
    expect(triggers[0].offsetWidth).toBe(40)
    api().setIndicatorRect('a')
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '40px', '--height': '23px' })
  })
})
