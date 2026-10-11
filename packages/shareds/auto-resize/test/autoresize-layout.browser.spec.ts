import { afterEach, describe, expect, it } from 'vitest'
import { autoResizeInput } from '../index'

const cleanups: Array<() => void> = []
const elements: HTMLElement[] = []
async function measure(value: string) {
  const input = document.createElement('input')
  input.style.cssText = 'font: 16px monospace; padding: 0; border: 0; box-sizing: content-box'
  input.value = value
  document.body.append(input)
  elements.push(input)
  cleanups.push(autoResizeInput(input)!)
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  const reference = document.createElement('span')
  reference.style.cssText = 'font: 16px monospace; padding: 0; border: 0; box-sizing: content-box; white-space: pre; display: inline-block'
  reference.textContent = input.value
  document.body.append(reference)
  elements.push(reference)
  const expected = reference.getBoundingClientRect().width
  const width = Number.parseFloat(input.style.width)
  expect(Math.abs(width - expected), `measured width: ${JSON.stringify(value)}`).toBeLessThanOrEqual(0.5)
  expect(Math.abs(input.getBoundingClientRect().width - expected), `rendered width: ${JSON.stringify(value)}`).toBeLessThanOrEqual(0.5)
  return width
}
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
  elements.splice(0).forEach(element => element.remove())
})
describe('auto-resize native browser geometry', () => {
  it('measures leading trailing and repeated spaces as input text', async () => {
    const plain = await measure('a b')
    expect(plain).toBeGreaterThan(0)
    for (const value of [' a b', 'a b ', 'a   b']) {
      const spaced = await measure(value)
      expect(spaced, `literal whitespace: ${JSON.stringify(value)}`).toBeGreaterThan(plain)
    }
    const empty = await measure('')
    const spaces = await measure('   ')
    expect(spaces).toBeGreaterThan(empty)
  })
  it('measures angle brackets and entity spelling as literal input text', async () => {
    const plain = await measure('tag')
    const markup = await measure('<b>tag</b>')
    const ampersand = await measure('&')
    const entity = await measure('&amp;')
    expect(markup).toBeGreaterThan(plain)
    expect(entity).toBeGreaterThan(ampersand)
    expect(document.querySelector('#ghost b')).toBeNull()
  })
})
