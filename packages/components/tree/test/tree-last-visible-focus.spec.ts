import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { focusScenarios, lastNodeKeys, setupLastNodeTree, verifyLastNode } from './tree-last-visible-focus.cases'

describe.each(focusScenarios)('native last-visible focus: $name', (scenario) => {
  it.each(lastNodeKeys)('%s retains a visible focus target', async (key) => {
    const fixture = setupLastNodeTree(scenario.expanded)
    for (let cycle = 0; cycle < 2; cycle++) {
      fixture.focusStart()
      await userEvent.keyboard(key === 'Meta+A' ? '{Meta>}a{/Meta}' : `{${key}}`)
      verifyLastNode(fixture, scenario.expected, scenario.expanded)
      expect(fixture.controls.get(scenario.expected)!.checkVisibility()).toBe(true)
    }
  })
})
