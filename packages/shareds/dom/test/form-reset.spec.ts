import { expect, it, vi } from 'vitest'
import { trackFormControl } from '../index'
import './form-reset.cases'

it('native reset completes its default action before the helper notifies', async () => {
  const form = document.createElement('form')
  const input = document.createElement('input')
  input.defaultValue = 'initial'
  input.value = 'edited'
  form.append(input)
  document.body.append(form)
  const order: string[] = []
  const onFormReset = vi.fn(() => order.push(`notification:${input.value}`))
  const stop = trackFormControl(input, { onFormReset, onFieldsetDisabledChange: vi.fn() })!
  form.addEventListener('reset', () => {
    order.push(`listener:${input.value}`)
    queueMicrotask(() => order.push(`microtask:${input.value}`))
  })

  try {
    form.reset()
    expect(onFormReset).not.toHaveBeenCalled()
    expect(order).toEqual(['listener:edited'])
    expect(input.value).toBe('initial')
    await Promise.resolve()
    expect(onFormReset).not.toHaveBeenCalled()
    expect(order).toEqual(['listener:edited', 'microtask:initial'])
    await new Promise<void>(resolve => window.setTimeout(resolve, 0))
    expect(order).toEqual(['listener:edited', 'microtask:initial', 'notification:initial'])
    expect(onFormReset).toHaveBeenCalledTimes(1)
  }
  finally {
    stop()
    form.remove()
  }
})
