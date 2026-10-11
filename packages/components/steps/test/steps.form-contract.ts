import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
type Activate = (button: HTMLButtonElement) => Promise<void>

function mountForm(context: Partial<UserDefinedContext> = {}, options: {
  triggerType?: HTMLButtonElement['type']
  preventClick?: boolean
} = {}) {
  const onStepChange = vi.fn(context.onStepChange)
  const service = machine({ id: 'steps-form-contract', count: 3, ...context, onStepChange }).start()
  const api = () => connect(service.getState(), service.send, normalize)
  const form = document.createElement('form')
  document.body.append(form)
  const onSubmit = vi.fn((event: Event) => event.preventDefault())
  form.addEventListener('submit', onSubmit)
  const bindings: Array<() => void> = []
  const listeners: Array<() => void> = []

  function bind<T extends HTMLElement>(element: T, getProps: () => Record<string, unknown>) {
    bindings.push(() => {
      for (const [key, value] of Object.entries(getProps())) {
        if (typeof value === 'function')
          continue
        // Boolean HTML properties must not be serialized as disabled="false".
        if (key === 'disabled' && element instanceof HTMLButtonElement)
          element.disabled = Boolean(value)
        else if (key === 'hidden')
          element.hidden = Boolean(value)
        else if (value == null)
          element.removeAttribute(key)
        else
          element.setAttribute(key, String(value))
      }
    })
    const onClick = (event: MouseEvent) => {
      if (options.preventClick)
        event.preventDefault()
      const handler = getProps().onClick
      if (typeof handler === 'function')
        Reflect.apply(handler, element, [event])
    }
    element.addEventListener('click', onClick)
    listeners.push(() => element.removeEventListener('click', onClick))
    return element
  }

  const list = bind(document.createElement('div'), () => api().getListProps())
  form.append(list)
  const triggers = Array.from({ length: 3 }, (_, index) => {
    const button = bind(document.createElement('button'), () => ({
      ...api().getTriggerProps({ index }),
      ...(options.triggerType ? { type: options.triggerType } : {}),
    }))
    button.textContent = `Step ${index + 1}`
    list.append(button)
    return button
  })
  const panels = Array.from({ length: 4 }, (_, index) => {
    const panel = bind(document.createElement('div'), () => api().getContentProps({ index }))
    panel.textContent = `Panel ${index + 1}`
    form.append(panel)
    return panel
  })
  const next = bind(document.createElement('button'), () => api().getNextTriggerProps())
  next.textContent = 'Next'
  const prev = bind(document.createElement('button'), () => api().getPrevTriggerProps())
  prev.textContent = 'Previous'
  const submit = document.createElement('button')
  submit.type = 'submit'
  submit.textContent = 'Submit form'
  form.append(prev, next, submit)
  const render = () => bindings.forEach(update => update())
  const unsubscribe = service.subscribe(render)
  render()
  let disposed = false

  return {
    service,
    api,
    form,
    triggers,
    panels,
    next,
    prev,
    submit,
    onSubmit,
    onStepChange,
    async sync(context: Partial<UserDefinedContext>) {
      service.setContext(context)
      await Promise.resolve()
    },
    dispose() {
      if (disposed)
        return
      disposed = true
      unsubscribe()
      listeners.forEach(remove => remove())
      form.removeEventListener('submit', onSubmit)
      service.stop()
      form.remove()
    },
  }
}

// Exercise the same actual machine/connector consumer in happy-dom and Chromium.
// Only the browser entry point supplies native pointer/keyboard activation.
export function formContracts(name: string, activate: Activate) {
  describe(`steps form contract: ${name}`, () => {
    const mounted: Array<ReturnType<typeof mountForm>> = []
    afterEach(() => mounted.splice(0).reverse().forEach(fixture => fixture.dispose()))

    function mount(...args: Parameters<typeof mountForm>) {
      const fixture = mountForm(...args)
      mounted.push(fixture)
      return fixture
    }

    it('changes an uncontrolled step without submitting its form', async () => {
      const fixture = mount()
      await activate(fixture.triggers[2])
      expect(fixture.api().value).toBe(2)
      expect(fixture.onStepChange.mock.calls).toEqual([[{ step: 2 }]])
      expect(fixture.triggers[2].getAttribute('aria-selected')).toBe('true')
      expect(fixture.panels.map(panel => panel.hidden)).toEqual([true, true, false, true])
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('keeps a controlled veto at the accepted step without submitting', async () => {
      const fixture = mount({ step: 0 })
      await activate(fixture.triggers[1])
      expect(fixture.onStepChange.mock.calls).toEqual([[{ step: 1 }]])
      expect(fixture.api().value).toBe(0)
      expect(fixture.triggers[0].getAttribute('aria-selected')).toBe('true')
      expect(fixture.panels.map(panel => panel.hidden)).toEqual([false, true, true, true])
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('renders a delayed parent acceptance once without repeating the proposal', async () => {
      const fixture = mount({ step: 0 })
      await activate(fixture.triggers[2])
      expect(fixture.api().value).toBe(0)
      await fixture.sync({ step: 2 })
      expect(fixture.api().value).toBe(2)
      expect(fixture.triggers[2].getAttribute('aria-selected')).toBe('true')
      expect(fixture.panels.map(panel => panel.hidden)).toEqual([true, true, false, true])
      expect(fixture.onStepChange.mock.calls).toEqual([[{ step: 2 }]])
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('renders an immediate parent acceptance without duplicate callbacks or submission', async () => {
      const fixture = mount({ step: 0, onStepChange: ({ step }) => fixture.service.setContext({ step }) })
      await activate(fixture.triggers[1])
      expect(fixture.api().value).toBe(1)
      expect(fixture.panels.map(panel => panel.hidden)).toEqual([true, false, true, true])
      expect(fixture.onStepChange.mock.calls).toEqual([[{ step: 1 }]])
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('does not propose or submit when the current step is activated again', async () => {
      const fixture = mount({ step: 1 })
      await activate(fixture.triggers[1])
      expect(fixture.api().value).toBe(1)
      expect(fixture.onStepChange).not.toHaveBeenCalled()
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('blocks a linear step trigger without submitting but permits next and previous', async () => {
      const fixture = mount({ linear: true })
      expect(fixture.triggers[2].tabIndex).toBe(-1)
      await activate(fixture.triggers[2])
      expect(fixture.api().value).toBe(0)
      expect(fixture.onStepChange).not.toHaveBeenCalled()
      expect(fixture.onSubmit).not.toHaveBeenCalled()
      await activate(fixture.next)
      expect(fixture.api().value).toBe(1)
      expect(fixture.triggers[1].tabIndex).toBe(0)
      await activate(fixture.prev)
      expect(fixture.api().value).toBe(0)
      expect(fixture.onStepChange.mock.calls).toEqual([[{ step: 1 }], [{ step: 0 }]])
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('honors a caller-prevented click for step, next, and previous triggers', async () => {
      const fixture = mount({ defaultStep: 1 }, { preventClick: true })
      for (const button of [fixture.triggers[2], fixture.next, fixture.prev])
        await activate(button)
      expect(fixture.api().value).toBe(1)
      expect(fixture.onStepChange).not.toHaveBeenCalled()
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('keeps navigation controls non-submitting through completion', async () => {
      const fixture = mount({ count: 3 })
      expect(fixture.prev.disabled).toBe(true)
      fixture.prev.click()
      expect(fixture.onStepChange).not.toHaveBeenCalled()
      for (let step = 1; step <= 3; step++) {
        await activate(fixture.next)
        expect(fixture.api().value).toBe(step)
      }
      expect(fixture.next.disabled).toBe(true)
      fixture.next.click()
      expect(fixture.onStepChange).toHaveBeenCalledTimes(3)
      expect(fixture.panels[3].hidden).toBe(false)
      await activate(fixture.prev)
      expect(fixture.api().value).toBe(2)
      expect(fixture.next.disabled).toBe(false)
      expect(fixture.onSubmit).not.toHaveBeenCalled()
    })

    it('allows an explicit caller type=submit override to retain native submission', async () => {
      const fixture = mount({}, { triggerType: 'submit' })
      await activate(fixture.triggers[1])
      expect(fixture.api().value).toBe(1)
      expect(fixture.onStepChange.mock.calls).toEqual([[{ step: 1 }]])
      expect(fixture.onSubmit).toHaveBeenCalledTimes(1)
    })

    it('retains an explicit submit override even when linear navigation is blocked', async () => {
      const fixture = mount({ linear: true }, { triggerType: 'submit' })
      await activate(fixture.triggers[2])
      expect(fixture.api().value).toBe(0)
      expect(fixture.onStepChange).not.toHaveBeenCalled()
      expect(fixture.onSubmit).toHaveBeenCalledTimes(1)
    })

    it('has a native submit positive control independent of the connector', async () => {
      const fixture = mount()
      await activate(fixture.submit)
      expect(fixture.onSubmit).toHaveBeenCalledTimes(1)
      expect(fixture.onStepChange).not.toHaveBeenCalled()
      expect(fixture.api().value).toBe(0)
    })

    it('disposes the stopped consumer and remounts without stale listeners or state', async () => {
      const previous = mount()
      await activate(previous.next)
      previous.dispose()
      previous.dispose()
      expect(previous.form.isConnected).toBe(false)
      previous.triggers[2].click()
      expect(previous.onStepChange.mock.calls).toEqual([[{ step: 1 }]])

      const current = mount()
      expect(current.api().value).toBe(0)
      await activate(current.triggers[2])
      expect(current.api().value).toBe(2)
      expect(current.onStepChange.mock.calls).toEqual([[{ step: 2 }]])
      expect(previous.onStepChange.mock.calls).toEqual([[{ step: 1 }]])
      expect(current.onSubmit).not.toHaveBeenCalled()
      expect(previous.onSubmit).not.toHaveBeenCalled()
    })
  })
}
