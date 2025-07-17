/** @jsxImportSource solid-js */
import { describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import AspectRatio from '~/solid/aspect-ratio'
import * as Tests from './spec'

describe('solid browser tests', () => {
  it('renders correctly', async () => {
    render(() => <AspectRatio />)
    await Tests.RendersCorrectly()
  })
})
