import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Tour from '~/react/tour'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('react browser tests', () => {
  beforeEach(async () => {
    render(<Tour />)
    Tests = new ComponentTestSuite()
  })

  it('should open tour on click start', async () => {
    await Tests.ShouldOpenTourOnClickStart()
  })

  it('should close on escape', async () => {
    await Tests.ShouldCloseOnEscape()
  })
})
