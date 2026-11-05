import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mountSteps } from './steps.keyboard-fixture'

const fixtures: ReturnType<typeof mountSteps>[] = []
afterEach(() => fixtures.splice(0).reverse().forEach(fixture => fixture.dispose()))

describe('steps native manual keyboard navigation', () => {
  it.each(['{Enter}', ' '])('moves focus by arrow and activates exactly once with %s', async (key) => {
    const f = mountSteps()
    fixtures.push(f)
    f.before.focus()
    await userEvent.tab()
    expect(document.activeElement).toBe(f.triggers[0])
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(f.triggers[1])
    expect(f.api().value).toBe(0)
    expect(f.onStepChange).not.toHaveBeenCalled()
    await userEvent.keyboard(key)
    expect(f.api().value).toBe(1)
    expect(f.onStepChange.mock.calls).toEqual([[{ step: 1 }]])
    await userEvent.tab()
    expect(document.activeElement).toBe(f.panels[1])
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(f.triggers[1])
  })

  it('returns to the selected tab after leaving an unselected focused tab', async () => {
    const f = mountSteps()
    fixtures.push(f)
    f.triggers[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.tab()
    expect(document.activeElement).toBe(f.panels[0])
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(f.triggers[0])
  })
})
