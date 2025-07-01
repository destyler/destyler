import { nanoid } from 'nanoid'
import { beforeAll, describe, it } from 'vitest'
import { Carousel, createCarouselElements } from '../model/Carousel'
import {
  AutoplayStartAndStop,
  ClickingIndicatorScrollsToCorrectSlide,
  IndicatorKeyboardNavigation,
  LoopShouldLoopSlides,
  NextAndPrevButtonsNavigateCarousel,
  RendersCorrectly,
  ScrollToSpecificIndexViaButton,
} from './carousel.spec'

describe('carousel vanilla browser tests', () => {
  beforeAll(async () => {
    const images = [
      'https://elonehoo.me/coffee/01.jpeg',
      'https://elonehoo.me/coffee/02.jpeg',
    ]
    const root = await createCarouselElements(images)
    document.body.appendChild(root)
    const carousel = new Carousel(root, {
      id: nanoid(),
      slideCount: images.length,
      spacing: '20px',
      slidesPerPage: 1,
      autoplay: false,
    })
    carousel.init()
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
})
