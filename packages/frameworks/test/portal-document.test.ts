import { PartType } from 'lit/directive.js'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PortalDirective } from '../lit/src/components/portal'
import { Portal } from '../react/src/components/portal'
import { createPortal } from '../vanilla/src/components/portal'

describe('portal server guards', () => {
  it('renders React content inline without evaluating a document getter', () => {
    const getRootNode = vi.fn((): Document => {
      throw new Error('No DOM during SSR')
    })
    const output = renderToString(createElement(Portal, { getRootNode }, createElement('span', null, 'inline')))
    expect(output).toBe('<span>inline</span>')
    expect(getRootNode).not.toHaveBeenCalled()
  })

  it('does not resolve a target or move Vanilla nodes without a DOM', () => {
    const getRootNode = vi.fn((): Document => {
      throw new Error('No DOM during SSR')
    })
    const remove = vi.fn()
    const node = { remove } as unknown as HTMLElement
    const cleanup = createPortal(node, { getRootNode }).mount()
    cleanup()
    expect(getRootNode).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
  })

  it('keeps Lit content inline without resolving a document on the server', () => {
    const getRootNode = vi.fn((): Document => {
      throw new Error('No DOM during SSR')
    })
    const directive = new PortalDirective({ type: PartType.CHILD })
    expect(directive.render('inline', undefined, { getRootNode })).toBe('inline')
    expect(getRootNode).not.toHaveBeenCalled()
  })
})
