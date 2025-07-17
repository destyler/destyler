import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Carousel from '~/react/carousel'
import * as Tests from './spec'

describe('carousel react browser tests', () => {
  it('renders correctly', async () => {
    render(<Carousel />)
    await Tests.RendersCorrectly()
  })

  it('autoplay start/stop', async () => {
    render(<Carousel />)
    await Tests.AutoplayStartAndStop()
  })

  it('clicking indicator scrolls to correct slide', async () => {
    render(<Carousel />)
    await Tests.ClickingIndicatorScrollsToCorrectSlide()
  })

  it('scroll to a specific index via button', async () => {
    render(<Carousel />)

    await Tests.ScrollToSpecificIndexViaButton()
  })

  it('indicator keyboard navigation', async () => {
    render(<Carousel />)
    await Tests.IndicatorKeyboardNavigation()
  })

  it('[loop=true] should loop slides', async () => {
    render(<Carousel />)

    await Tests.LoopShouldLoopSlides()
  })

  it('next and prev buttons navigate carousel', async () => {
    render(<Carousel />)
    await Tests.NextAndPrevButtonsNavigateCarousel()
  })
})
