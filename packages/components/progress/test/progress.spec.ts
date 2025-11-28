import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../examples/vanilla/Progress'

let el: HTMLElement

const scope = '[data-scope="progress"]'
function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element)
    throw new Error(`Unable to find element with selector: ${selector}`)
  return element
}

const getRoot = () => getElement<HTMLElement>(`${scope}[data-part="root"]`)
const getTrack = () => getElement<HTMLElement>(`${scope}[data-part="track"]`)
const getRange = () => getElement<HTMLElement>(`${scope}[data-part="range"]`)
const getValueText = () => getElement<HTMLElement>(`${scope}[data-part="value-text"]`)
const getCircleRange = () => getElement<SVGCircleElement>(`${scope}[data-part="circle-range"]`)
const increaseButton = () => getElement<HTMLButtonElement>('[data-progress-increase]')
const decreaseButton = () => getElement<HTMLButtonElement>('[data-progress-decrease]')
const indeterminateButton = () => getElement<HTMLButtonElement>('[data-progress-indeterminate]')
const dirControl = () => getElement<HTMLSelectElement>('[data-testid="dir"]')

async function waitForLinearValue(value: number) {
  const root = getRoot()
  const track = getTrack()
  const range = getRange()
  const valueText = getValueText()
  await vi.waitFor(() => {
    expect(root.dataset.value).toBe(String(value))
    expect(track.getAttribute('aria-valuenow')).toBe(String(value))
    expect(range.style.width).toBe(`${value}%`)
    expect(valueText.textContent).toBe(`${value} percent`)
  })
}

async function clickAndWait(button: HTMLButtonElement, value: number) {
  button.click()
  await waitForLinearValue(value)
}

function mount() {
  if (el)
    document.body.removeChild(el)

  el = document.createElement('div')
  document.body.appendChild(el)
  render(el)
}

describe('progress browser tests', () => {
  beforeEach(() => {
    mount()
  })

  it('renders determinate progress with correct anatomy and aria attributes', () => {
    const root = getRoot()
    const track = getTrack()
    const range = getRange()
    const valueText = getValueText()
    const circleRange = getCircleRange()

    expect(root.dataset.scope).toBe('progress')
    expect(root.dataset.part).toBe('root')
    expect(root.getAttribute('dir')).toBe('ltr')
    expect(root.dataset.state).toBe('loading')
    expect(root.dataset.orientation).toBe('horizontal')
    expect(root.dataset.value).toBe('50')

    expect(track.getAttribute('role')).toBe('progressbar')
    expect(track.getAttribute('aria-valuemin')).toBe('0')
    expect(track.getAttribute('aria-valuemax')).toBe('100')
    expect(track.getAttribute('aria-valuenow')).toBe('50')

    expect(range.dataset.state).toBe('loading')
    expect(range.dataset.orientation).toBe('horizontal')
    expect(range.style.width).toBe('50%')

    expect(valueText.textContent).toBe('50 percent')
    expect(circleRange.dataset.state).toBe('loading')
    expect(circleRange.style.getPropertyValue('--percent')).toBe('50')
  })

  it('updates measurements when value changes through control buttons', async () => {
    const increase = increaseButton()
    const decrease = decreaseButton()

    await clickAndWait(increase, 70)
    await clickAndWait(decrease, 50)
    await clickAndWait(decrease, 30)
  })

  it('clamps the value at the max and exposes the complete state', async () => {
    const root = getRoot()
    const track = getTrack()
    const range = getRange()
    const increase = increaseButton()

    await clickAndWait(increase, 70)
    await clickAndWait(increase, 90)
    await clickAndWait(increase, 100)
    await clickAndWait(increase, 100)
    await clickAndWait(increase, 100)

    await vi.waitFor(() => {
      expect(track.getAttribute('aria-valuenow')).toBe('100')
      expect(root.dataset.state).toBe('complete')
      expect(range.dataset.state).toBe('complete')
    })
  })

  it('goes indeterminate when requested', async () => {
    const root = getRoot()
    const track = getTrack()
    const range = getRange()
    const valueText = getValueText()

    indeterminateButton().click()

    await vi.waitFor(() => {
      expect(root.dataset.state).toBe('indeterminate')
      expect(range.dataset.state).toBe('indeterminate')
      expect(track.hasAttribute('aria-valuenow')).toBe(false)
      expect(valueText.textContent).toBe('loading...')
      expect(range.style.width).toBe('')
    })
  })

  it('exposes the layout direction from the shared controls', async () => {
    const root = getRoot()
    const track = getTrack()
    const control = dirControl()

    control.value = 'rtl'
    control.dispatchEvent(new Event('change', { bubbles: true }))

    await vi.waitFor(() => {
      expect(root.getAttribute('dir')).toBe('rtl')
      expect(track.getAttribute('dir')).toBe('rtl')
    })
  })

  it('handles the lower bound and hides the circular stroke at zero', async () => {
    const circleRange = getCircleRange()
    const decrease = decreaseButton()

    await clickAndWait(decrease, 30)
    await clickAndWait(decrease, 10)
    await clickAndWait(decrease, 0)

    await vi.waitFor(() => {
      expect(circleRange.getAttribute('opacity')).toBe('0')
    })
  })
})
