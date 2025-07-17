/** @jsxImportSource solid-js */
import { describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Breadcrumbs from '~/solid/breadcrumbs'
import * as Tests from './spec'

describe('breadcrumbs react browser tests', () => {
  it('renders correctly', async () => {
    render(() => <Breadcrumbs />)
    await Tests.RendersCorrectly()
  })
})
