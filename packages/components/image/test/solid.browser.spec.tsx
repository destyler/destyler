/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Image from '~/solid/image'
import { ImageTestSuite } from './spec'

let Tests: ImageTestSuite

describe('image solid browser tests', () => {
  beforeEach(async () => {
    render(() => <Image />)
    Tests = new ImageTestSuite()
  })

  it('should render correctly', async () => {
    await Tests.ShouldRenderCorrectly()
  })
})
