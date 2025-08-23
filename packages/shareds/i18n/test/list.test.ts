import { describe, expect, it } from 'vitest'
import { formatList } from '../index'

const items = ['react', 'svelte', 'vue']

describe('formatList', () => {
  it('conjunction / and', () => {
    expect(formatList(items, 'en-US')).toMatchInlineSnapshot(`"react, svelte, and vue"`)
    expect(formatList(items, 'fr-FR')).toMatchInlineSnapshot(`"react, svelte et vue"`)
  })

  it('conjunction / and + short', () => {
    expect(formatList(items, 'en-US', { style: 'short' })).toMatchInlineSnapshot(`"react, svelte, & vue"`)
    expect(formatList(items, 'fr-FR', { style: 'short' })).toMatchInlineSnapshot(`"react, svelte et vue"`)
  })

  it('disjunction / or', () => {
    expect(formatList(items, 'en-US', { style: 'short', type: 'disjunction' })).toMatchInlineSnapshot(
      `"react, svelte, or vue"`,
    )
  })
})
