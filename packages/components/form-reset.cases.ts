import { describe, expect, it } from 'vitest'
import { mountReset, nextResetTask, resetDefinitions } from './form-reset.fixtures'

export function formResetCases(reset: (form: HTMLFormElement) => void) {
  describe.each(resetDefinitions)('$name form reset', (definition) => {
    // Dynamic's existing value API mutates its own state; it does not implement
    // controlled accept/veto ownership. Reset must retain that existing contract.
    const ownerships = definition.name === 'dynamic'
      ? ['uncontrolled'] as const
      : ['uncontrolled', 'accept', 'veto'] as const

    it.each(ownerships)('notifies in the next task while preserving %s ownership', async (ownership) => {
      const view = await mountReset(definition, ownership)
      reset(view.form)
      expect(view.changes).not.toHaveBeenCalled()
      expect(view.read()).toEqual(view.current)
      await Promise.resolve()
      expect(view.changes).not.toHaveBeenCalled()
      expect(view.read()).toEqual(view.current)
      await nextResetTask()
      expect(view.proposed()).toEqual([view.initial])
      expect(view.read()).toEqual(ownership === 'veto' ? view.current : view.initial)
    })

    it.each(['later form', 'ancestor'] as const)('a %s cancellation preserves current value and suppresses notifications', async (location) => {
      const view = await mountReset(definition, definition.name === 'dynamic' ? 'uncontrolled' : 'accept')
      const submitted = view.submitted()
      const target = location === 'later form' ? view.form : view.container
      target.addEventListener('reset', event => event.preventDefault())
      reset(view.form)
      await nextResetTask()
      expect(view.changes).not.toHaveBeenCalled()
      expect(view.read()).toEqual(view.current)
      expect(view.submitted()).toEqual(submitted)
    })

    it('stopping the machine before the reset task discards the old notification', async () => {
      const view = await mountReset(definition)
      reset(view.form)
      view.service.stop()
      await nextResetTask()
      expect(view.changes).not.toHaveBeenCalled()
      expect(view.read()).toEqual(view.current)
    })
  })
}
