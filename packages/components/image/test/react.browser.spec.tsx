import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Image from '~/react/image'
import { ImageTestSuite } from './spec'

let Tests: ImageTestSuite

describe('image react browser tests', () => {
  beforeEach(async () => {
    render(<Image />)
    Tests = new ImageTestSuite()
  })

  it('should render correctly', async () => {
    await Tests.ShouldRenderCorrectly()
  })

})
