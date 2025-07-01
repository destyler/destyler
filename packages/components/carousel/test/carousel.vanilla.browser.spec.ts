import { carouselControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { nanoid } from 'nanoid'
import { beforeAll, describe, it } from 'vitest'
import {
  AutoplayStartAndStop,
  ClickingIndicatorScrollsToCorrectSlide,
  IndicatorKeyboardNavigation,
  LoopShouldLoopSlides,
  NextAndPrevButtonsNavigateCarousel,
  RendersCorrectly,
  ScrollToSpecificIndexViaButton,
} from './carousel.spec'
import { Carousel, createCarouselElements } from './fixtures/Carousel'

describe('carousel vanilla browser tests', () => {
  beforeAll(async () => {
    const images = [
      'https://elonehoo.me/coffee/01.jpeg',
      'https://elonehoo.me/coffee/02.jpeg',
    ]
    const root = await createCarouselElements(images)
    const control = useControls(carouselControls)
    document.body.appendChild(root)
    document.body.appendChild(
      Toolbar({
        controlsSlot: () => Controls(control),
        visualizerSlot: () => StateVisualizer({ state: control.context }),
      }),
    )

    const id = nanoid()
    const carousel = new Carousel(root, {
      ...control.context,
      id,
      slideCount: images.length,
      spacing: '20px',
      slidesPerPage: 1,
      autoplay: false,
    })
    carousel.init()

    control.subscribe(() => {
      const carousel = new Carousel(root, {
        ...control.context,
        id,
        slideCount: images.length,
        spacing: '20px',
        slidesPerPage: 1,
        autoplay: false,
      })
      carousel.init()
    })
  })

  it('renders name', async () => {
    await RendersCorrectly()
  })

  it('next/prev buttons navigate carousel', async () => {
    await NextAndPrevButtonsNavigateCarousel()
  })

  it('autoplay start/stop', async () => {
    await AutoplayStartAndStop()
  })

  it('clicking indicator scrolls to correct slide', async () => {
    await ClickingIndicatorScrollsToCorrectSlide()
  })

  it('scroll to a specific index via button', async () => {
    await ScrollToSpecificIndexViaButton()
  })

  it('indicator keyboard navigation', async () => {
    await IndicatorKeyboardNavigation()
  })

  it('[loop=true] should loop slides', async () => {
    await LoopShouldLoopSlides()
  })
})
