import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { preventBodyScroll } from '../src/remove-scroll'

let bodyStyle: string
let rootStyle: string
let lockAttribute: string | null
let cleanup: VoidFunction | undefined

beforeEach(() => {
  bodyStyle = document.body.style.cssText
  rootStyle = document.documentElement.style.cssText
  lockAttribute = document.body.getAttribute('data-scroll-lock')
  document.body.removeAttribute('data-scroll-lock')
  document.body.style.cssText = ''
  document.documentElement.style.cssText = ''
  cleanup = undefined
  vi.stubGlobal('navigator', { platform: 'Linux' })
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  cleanup?.()
  document.body.style.cssText = bodyStyle
  document.documentElement.style.cssText = rootStyle
  if (lockAttribute === null)
    document.body.removeAttribute('data-scroll-lock')
  else
    document.body.setAttribute('data-scroll-lock', lockAttribute)
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function release() {
  const dispose = cleanup
  cleanup = undefined
  dispose?.()
}

describe('scroll lock style restoration', () => {
  it.each([
    { platform: 'Linux', side: 'right' },
    { platform: 'Linux', side: 'left' },
    { platform: 'iPhone', side: 'right' },
    { platform: 'iPhone', side: 'left' },
  ] as const)('restores existing $side padding on $platform', ({ platform, side }) => {
    vi.stubGlobal('navigator', { platform })
    vi.spyOn(document.documentElement, 'getBoundingClientRect').mockReturnValue(new DOMRect(side === 'left' ? 1 : 0, 0, 0, 0))
    const body = document.body
    body.style.cssText = 'padding-left: 13px; padding-right: 17px; overflow: auto; position: relative; top: 3px; left: 4px; right: 5px; color: red'
    document.documentElement.style.setProperty('--scrollbar-width', '11px')
    const previous = {
      paddingLeft: body.style.paddingLeft,
      paddingRight: body.style.paddingRight,
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      color: body.style.color,
    }

    cleanup = preventBodyScroll(document)
    expect(cleanup).toBeTypeOf('function')
    expect(body.style.overflow).toBe('hidden')
    expect(body.style[side === 'left' ? 'paddingLeft' : 'paddingRight']).toBe(`${window.innerWidth - document.documentElement.clientWidth}px`)
    expect(body.hasAttribute('data-scroll-lock')).toBe(true)
    if (platform === 'iPhone')
      expect(body.style.position).toBe('fixed')

    release()
    for (const [property, value] of Object.entries(previous))
      expect(body.style[property as keyof typeof previous], property).toBe(value)
    expect(document.documentElement.style.getPropertyValue('--scrollbar-width')).toBe('11px')
    expect(body.hasAttribute('data-scroll-lock')).toBe(false)
    expect(window.scrollTo).toHaveBeenCalledTimes(platform === 'iPhone' ? 1 : 0)
  })

  it('removes temporary properties that were originally absent', () => {
    cleanup = preventBodyScroll(document)
    expect(document.body.style.overflow).toBe('hidden')
    release()
    expect(document.body.style.paddingRight).toBe('')
    expect(document.body.style.overflow).toBe('')
    expect(document.documentElement.style.getPropertyValue('--scrollbar-width')).toBe('')
  })

  it('does not acquire or change an externally marked lock', () => {
    document.body.style.cssText = 'padding-right: 9px; overflow: scroll'
    document.body.setAttribute('data-scroll-lock', 'external')
    cleanup = preventBodyScroll(document)
    expect(cleanup).toBeUndefined()
    expect(document.body.style.paddingRight).toBe('9px')
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.body.getAttribute('data-scroll-lock')).toBe('external')
  })
})
