import { checkboxControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { nanoid } from 'nanoid'
import { beforeAll, describe, it } from 'vitest'
import {
  ShouldBeCheckedWhenClicked,
  ShouldBeCheckedWhenSpacebarIsPressedWhileFocused,
  ShouldBeFocusedWhenPageIsTabbed,
  ShouldHaveDisabledAttributesWhenDisabled,
  ShouldNotBeFocusableWhenDisabled,
} from './checkbox.spec'
import { Checkbox, createCheckboxElements } from './fixtures/Checkbox'

describe('checkbox vanilla browser tests', () => {
  let checkbox: Checkbox

  beforeAll(async () => {
    const root = await createCheckboxElements()
    const control = useControls(checkboxControls)
    document.body.appendChild(root)
    document.body.appendChild(
      Toolbar({
        controlsSlot: () => Controls(control),
        visualizerSlot: () => StateVisualizer({ state: control.context }),
      }),
    )

    const id = nanoid()
    const createContext = () => ({
      ...control.context,
      id,

    })

    checkbox = new Checkbox(root, createContext())
    checkbox.init()

    control.subscribe(() => {
      const newContext = createContext()
      checkbox.updateContext(newContext)
    })
  })

  it('should be checked when clicked', async () => {
    await ShouldBeCheckedWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    await ShouldBeFocusedWhenPageIsTabbed()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it('should have disabled attributes when disabled', async () => {
    await ShouldHaveDisabledAttributesWhenDisabled()
  })

  it('should not be focusable when disabled', async () => {
    await ShouldNotBeFocusableWhenDisabled()
  })
})
