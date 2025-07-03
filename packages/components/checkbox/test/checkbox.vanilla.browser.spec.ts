import { checkboxControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { nanoid } from 'nanoid'
import { beforeAll, describe, it } from 'vitest'
import { RendersCorrectly } from './checkbox.spec'
import { Checkbox, createCheckboxElements } from './fixtures/Checkbox'

describe('aspect-ratio vanilla browser tests', () => {
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

  it('renders correctly', async () => {
    await RendersCorrectly()
  })
})
