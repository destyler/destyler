import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Carousel from '~/svelte/carousel.svelte'
import { CarouselTestSuite } from './spec'

let Tests: CarouselTestSuite

describe('carousel svelte browser tests', () => {
  beforeEach(async () => {
    render(Carousel)
    Tests = new CarouselTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })

  it('autoplay start/stop', async () => {
    await Tests.AutoplayStartAndStop()
  })

  it('clicking indicator scrolls to correct slide', async () => {
    await Tests.ClickingIndicatorScrollsToCorrectSlide()
  })

  it('scroll to a specific index via button', async () => {
    await Tests.ScrollToSpecificIndexViaButton()
  })

  it('indicator keyboard navigation', async () => {
    await Tests.IndicatorKeyboardNavigation()
  })

  it('[loop=true] should loop slides', async () => {
    await Tests.LoopShouldLoopSlides()
  })

  it('next and prev buttons navigate carousel', async () => {
    await Tests.NextAndPrevButtonsNavigateCarousel()
  })
})
