import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { setupSiblingTree, verifySiblingExpansion } from './tree-sibling-expansion.cases'

it.each(['nested', 'leaf'])('native asterisk from %s keeps focus visible through repeated expansion', async (focused) => {
  const fixture = setupSiblingTree()
  fixture.controls.get(focused)!.focus()
  for (let cycle = 0; cycle < 2; cycle++) {
    await userEvent.keyboard('*')
    verifySiblingExpansion(fixture, focused)
    expect(fixture.controls.get(focused)!.checkVisibility()).toBe(true)
  }
  expect(fixture.onExpandedChange).toHaveBeenCalledTimes(1)
})
