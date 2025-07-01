import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import {
  AutoplayStartAndStop,
  ClickingIndicatorScrollsToCorrectSlide,
  IndicatorKeyboardNavigation,
  LoopShouldLoopSlides,
  NextAndPrevButtonsNavigateCarousel,
  RendersCorrectly,
  ScrollToSpecificIndexViaButton,
} from './carousel.spec'
import Carousel from './fixtures/Carousel.vue'

describe('carousel vue browser tests', () => {
  it('renders correctly', async () => {
    render(Carousel)
    await RendersCorrectly()
  })

  it('next/prev buttons navigate carousel', async () => {
    render(Carousel)
    await NextAndPrevButtonsNavigateCarousel()
  })

  it('autoplay start/stop', async () => {
    render(Carousel)
    await AutoplayStartAndStop()
  })

  it('clicking indicator scrolls to correct slide', async () => {
    render(Carousel)
    await ClickingIndicatorScrollsToCorrectSlide()
  })

  it('scroll to a specific index via button', async () => {
    render(Carousel)

    await ScrollToSpecificIndexViaButton()
  })

  it('indicator keyboard navigation', async () => {
    render(Carousel)
    await IndicatorKeyboardNavigation()
  })

  it('[loop=true] should loop slides', async () => {
    render(Carousel)

    await LoopShouldLoopSlides()
  })
})
