import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../../components/combobox/src/collection'
import { connect } from '../../components/combobox/src/connect'
import { machine } from '../../components/combobox/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const items = [{ value: 'a', label: 'Alpha' }]
const services: ReturnType<typeof machine>[] = []
afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
})

describe('combobox controlled input initialization', () => {
  for (const selectionBehavior of ['replace', 'clear', 'preserve'] as const) {
    it.each(['', ' ', '\t', 'Custom'])(`${selectionBehavior} preserves explicitly controlled input %j`, (inputValue) => {
      const onInputValueChange = vi.fn()
      const service = machine({
        id: 'controlled-initial-input',
        collection: collection({ items }),
        defaultValue: ['a'],
        inputValue,
        selectionBehavior,
        onInputValueChange,
      })
      services.push(service)
      service._created()
      service.start()
      const api = connect(service.getState(), service.send, normalize)
      expect(api.inputValue).toBe(inputValue)
      expect(api.getInputProps().value).toBe(inputValue)
      expect(api.selectedItems).toEqual(items)
      expect(api.valueAsString).toBe('Alpha')
      expect(onInputValueChange).not.toHaveBeenCalled()
    })
  }

  it.each([
    ['replace', 'Alpha'],
    ['preserve', 'Alpha'],
    ['clear', ''],
  ] as const)('%s retains uncontrolled selected-label initialization', (selectionBehavior, expected) => {
    const service = machine({ id: 'uncontrolled-initial-input', collection: collection({ items }), defaultValue: ['a'], selectionBehavior })
    services.push(service)
    service._created()
    service.start()
    expect(connect(service.getState(), service.send, normalize).inputValue).toBe(expected)
  })

  it('retains an uncontrolled default query over the selected label', () => {
    const service = machine({ id: 'default-initial-input', collection: collection({ items }), defaultValue: ['a'], defaultInputValue: 'Query' })
    services.push(service)
    service._created()
    service.start()
    expect(connect(service.getState(), service.send, normalize).inputValue).toBe('Query')
  })

  it('retains empty multiple-selection input initialization', () => {
    const service = machine({ id: 'multiple-initial-input', collection: collection({ items }), defaultValue: ['a'], multiple: true })
    services.push(service)
    service._created()
    service.start()
    expect(connect(service.getState(), service.send, normalize).inputValue).toBe('')
  })
})
