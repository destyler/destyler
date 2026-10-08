import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const cleanups: VoidFunction[] = []
let count = 0
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
afterEach(async () => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  await frame()
  await frame()
})

function setup(context: Partial<UserDefinedContext> = {}, values = ['', 'b'], indicator = false) {
  const service = machine({ id: `empty-value-${count++}`, defaultValue: '', ...context })
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const list = document.createElement('div')
  list.id = api().getListProps().id!
  root.append(list)
  const contents: HTMLElement[] = []
  const triggers = values.map((value, index) => {
    const props = api().getTriggerProps({ value })
    const trigger = document.createElement('button')
    trigger.id = props.id!
    trigger.setAttribute('role', 'tab')
    trigger.setAttribute('data-ownedby', list.id)
    trigger.dataset.value = value
    trigger.addEventListener('focus', event => Reflect.apply(props.onFocus!, trigger, [event]))
    Object.defineProperty(trigger, 'offsetWidth', { value: 37 + index })
    list.append(trigger)
    const content = document.createElement('div')
    content.id = api().getContentProps({ value }).id!
    root.append(content)
    contents.push(content)
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
  return { service, api, triggers, contents }
}

describe('tabs empty-string logical values', () => {
  it('focuses a selected empty-string tab', () => {
    const { api, triggers } = setup()
    expect(api().value).toBe('')
    api().focus()
    expect(document.activeElement).toBe(triggers[0])
  })

  it.each(['selectNext', 'selectPrev'] as const)('navigates from an empty-string value with %s', async (method) => {
    const { api, triggers } = setup()
    triggers[0].focus()
    api()[method]('')
    await frame()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('b')
  })

  it('keeps controlled empty selection until the parent accepts a nonempty proposal', async () => {
    const onValueChange = vi.fn()
    const { service, api, triggers } = setup({ value: '', onValueChange })
    triggers[0].focus()
    api().selectNext('')
    await frame()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
    service.setContext({ value: 'b' })
    expect(api().value).toBe('b')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('moves focus without selection in manual activation mode', async () => {
    const { api, triggers } = setup({ activationMode: 'manual' })
    triggers[0].focus()
    api().selectNext('')
    await frame()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('')
  })

  it('synchronizes the selected empty-value panel tab index', async () => {
    const { api, contents } = setup()
    api().syncTabIndex()
    await frame()
    expect(contents[0].getAttribute('tabindex')).toBe('0')
    expect(contents[1].hasAttribute('tabindex')).toBe(false)
  })

  it('measures the selected empty-value indicator target', () => {
    const { service, api } = setup({}, ['', 'b'], true)
    // Use the existing action's selected-value fallback, independently of connector routing.
    service.send({ type: 'SET_INDICATOR_RECT' })
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '37px' })
  })

  it('starts observing indicator geometry for an empty selected value', async () => {
    const { api } = setup({}, ['', 'b'], true)
    await frame()
    expect(api().getIndicatorProps().style).toMatchObject({ '--width': '37px' })
  })

  it.each([' ', '0'])('preserves other truthy string values %j', (value) => {
    const { api, triggers } = setup({ defaultValue: value }, [value, 'b'])
    api().focus()
    expect(document.activeElement).toBe(triggers[0])
    expect(api().value).toBe(value)
  })

  it('keeps null as absent selection and does not focus an empty-value trigger', () => {
    const { api, triggers } = setup({ defaultValue: null })
    api().focus()
    expect(document.activeElement).not.toBe(triggers[0])
    expect(api().value).toBe(null)
    expect(api().getContentProps({ value: '' }).hidden).toBe(true)
  })
})
