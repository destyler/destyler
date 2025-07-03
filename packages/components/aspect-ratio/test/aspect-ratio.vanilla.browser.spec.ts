import { aspectRatioControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { nanoid } from 'nanoid'
import { beforeAll, describe, it } from 'vitest'
import { RendersCorrectly } from './aspect-ratio.spec'
import { AspectRatio, createAspectRatio } from './fixtures/AspectRatio'

describe('aspect-ratio vanilla browser tests', () => {
  let aspectRatio: AspectRatio

  beforeAll(async () => {
    const root = await createAspectRatio()
    const control = useControls(aspectRatioControls)
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

    aspectRatio = new AspectRatio(root, createContext())
    aspectRatio.init()

    control.subscribe(() => {
      const newContext = createContext()
      aspectRatio.updateContext(newContext)
    })
  })

  it('renders correctly', async () => {
    await RendersCorrectly()
  })
})
