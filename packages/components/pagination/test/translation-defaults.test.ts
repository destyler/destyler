import type { PropTypes } from '@destyler/types'
import type { IntlTranslations } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from '../../../store/src/proxy'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(props => props)
const services: Array<ReturnType<typeof machine>> = []

function start(translations?: IntlTranslations) {
  const service = machine({ id: 'pagination-translations', count: 30, translations }).start()
  services.push(service)
  return connect(service.getState(), service.send, normalize)
}

function labels(api: ReturnType<typeof start>) {
  return {
    root: api.getRootProps()['aria-label'],
    previous: api.getPrevTriggerProps()['aria-label'],
    next: api.getNextTriggerProps()['aria-label'],
    first: api.getItemProps({ type: 'page', value: 1 })['aria-label'],
    last: api.getItemProps({ type: 'page', value: 3 })['aria-label'],
  }
}

const defaults = {
  root: 'pagination',
  previous: 'previous page',
  next: 'next page',
  first: 'page 1',
  last: 'last page, page 3',
}

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
})

describe('pagination translation defaults', () => {
  it('uses all default labels when translations are omitted', () => {
    expect(labels(start())).toEqual(defaults)
  })

  it('preserves all default labels with an empty translations object', () => {
    expect(labels(start({}))).toEqual(defaults)
  })

  it.each([
    { translations: { rootLabel: 'Pages' }, expected: { root: 'Pages' } },
    { translations: { prevTriggerLabel: 'Back' }, expected: { previous: 'Back' } },
    { translations: { nextTriggerLabel: 'Forward' }, expected: { next: 'Forward' } },
  ])('keeps omitted defaults beside $translations', ({ translations, expected }) => {
    expect(labels(start(translations))).toEqual({ ...defaults, ...expected })
  })

  it('uses a custom item formatter with current page details and keeps other defaults', () => {
    const itemLabel = vi.fn(({ page, totalPages }) => `${page} of ${totalPages}`)
    const api = start({ itemLabel })

    expect(labels(api)).toEqual({ ...defaults, first: '1 of 3', last: '3 of 3' })
    expect(itemLabel.mock.calls).toEqual([[{ page: 1, totalPages: 3 }], [{ page: 3, totalPages: 3 }]])
  })

  it('preserves a full set of custom labels', () => {
    expect(labels(start({
      rootLabel: 'Pages',
      prevTriggerLabel: 'Back',
      nextTriggerLabel: 'Forward',
      itemLabel: ({ page }) => `Go ${page}`,
    }))).toEqual({ root: 'Pages', previous: 'Back', next: 'Forward', first: 'Go 1', last: 'Go 3' })
  })

  it('uses defaults for compacted undefined fields and preserves empty string overrides', () => {
    expect(labels(start({ rootLabel: undefined, nextTriggerLabel: '' }))).toEqual({
      ...defaults,
      root: 'pagination',
      next: '',
    })
  })
})

describe('translation object compatibility', () => {
  it('preserves inherited formatters and their this-dependent helpers', () => {
    class Labels {
      prefix = 'Custom'
      format(page: number) { return `${this.prefix} ${page}` }
      itemLabel({ page }: { page: number }) { return this.format(page) }
    }
    const api = start(new Labels())
    expect(api.getItemProps({ type: 'page', value: 3 })['aria-label']).toBe('Custom 3')
  })

  it('preserves own accessors and nonenumerable formatters', () => {
    class Labels {
      prefix = 'Custom'
    }
    const translations: IntlTranslations & Labels = new Labels()
    Object.defineProperties(translations, {
      rootLabel: { get() { return `${this.prefix} pages` }, enumerable: false },
      itemLabel: {
        value(this: Labels, { page }: { page: number }) { return `${this.prefix} ${page}` },
        enumerable: false,
      },
    })
    const api = start(translations)
    expect(api.getRootProps()['aria-label']).toBe('Custom pages')
    expect(api.getItemProps({ type: 'page', value: 3 })['aria-label']).toBe('Custom 3')

    const service = services.at(-1)!
    ;(service.state.context.translations as Labels).prefix = 'Changed'
    const updated = connect(service.getState(), service.send, normalize)
    expect(updated.getRootProps()['aria-label']).toBe('Changed pages')
    expect(updated.getItemProps({ type: 'page', value: 2 })['aria-label']).toBe('Changed 2')
  })

  it('does not mutate caller-owned plain translations', () => {
    const translations = Object.freeze({ rootLabel: 'Pages' })
    const before = Object.getOwnPropertyDescriptors(translations)
    expect(start(translations).getRootProps()['aria-label']).toBe('Pages')
    expect(Object.getOwnPropertyDescriptors(translations)).toEqual(before)
    expect(Object.isFrozen(translations)).toBe(true)
  })

  it('does not mutate frozen class instances when adding missing defaults', () => {
    class Labels {
      prefix = 'Custom'
      itemLabel({ page }: { page: number }) { return `${this.prefix} ${page}` }
    }
    const translations = Object.freeze(new Labels())
    const before = Object.getOwnPropertyDescriptors(translations)
    const api = start(translations)
    expect(api.getItemProps({ type: 'page', value: 2 })['aria-label']).toBe('Custom 2')
    expect(Object.getOwnPropertyDescriptors(translations)).toEqual(before)
    expect(Object.isFrozen(translations)).toBe(true)
    expect('prevTriggerLabel' in translations).toBe(false)
  })

  it('preserves explicit undefined and empty class properties', () => {
    class Labels {
      rootLabel = undefined
      nextTriggerLabel = ''
    }
    const api = start(new Labels())
    expect(api.getRootProps()['aria-label']).toBeUndefined()
    expect(api.getNextTriggerProps()['aria-label']).toBe('')
  })
})

it('preserves original receivers for ref-backed private state and accessors', () => {
  class Labels {
    #prefix = 'Private'
    get rootLabel() { return `${this.#prefix} pages` }
    itemLabel({ page }: { page: number }) { return `${this.#prefix} ${page}` }
  }
  const translations = ref(new Labels())
  const api = start(translations)
  expect(api.getRootProps()['aria-label']).toBe('Private pages')
  expect(api.getItemProps({ type: 'page', value: 2 })['aria-label']).toBe('Private 2')
  expect(services.at(-1)!.state.context.translations).toBe(translations)
})

it('preserves original receivers for ref-backed external WeakMap state', () => {
  const state = new WeakMap<object, string>()
  class Labels {
    constructor() { state.set(this, 'Original') }
    get rootLabel() { return `${state.get(this)} pages` }
    itemLabel({ page }: { page: number }) { return `${state.get(this)} ${page}` }
  }
  const translations = ref(new Labels())
  const api = start(translations)
  expect(api.getRootProps()['aria-label']).toBe('Original pages')
  expect(api.getItemProps({ type: 'page', value: 2 })['aria-label']).toBe('Original 2')
  expect(services.at(-1)!.state.context.translations).toBe(translations)
})
