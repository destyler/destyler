import { describe, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { keyboardCases, setupKeyboardTree, verifyKey } from './tree-disabled-keyboard.cases'

describe.each([false, true])('native tree keyboard guards (disabled=%s)', (disabled) => {
  it.each(keyboardCases)('$part $key (expanded=$expanded)', async (c) => {
    const fixture = setupKeyboardTree(c.part, disabled, c.expanded)
    const key = c.key === 'a' ? '{Meta>}a{/Meta}' : c.key === ' ' ? ' ' : c.key === '*' ? '*' : `{${c.key}}`
    await userEvent.keyboard(key)
    verifyKey(fixture, c, disabled)
  })
})
