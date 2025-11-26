import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../examples/vanilla/Toast'

let mountEl: HTMLElement

const scopeSelector = '[data-scope="toast"]'
const partSelector = (part: string) => `${scopeSelector}[data-part="${part.replace(/([A-Z])/g, '-$1').toLowerCase()}"]`
const rootSelector = partSelector('root')
const titleSelector = partSelector('title')
const descriptionSelector = partSelector('description')
const closeSelector = partSelector('closeTrigger')

function getLatestElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element)
    throw new Error(`Expected element for selector: ${selector}`)
  return element
}

function getLatestToastRoot() {
  return getLatestElement<HTMLElement>(rootSelector)
}

function getLatestTitle() {
  return getLatestElement<HTMLElement>(titleSelector)
}

function getLatestDescription() {
  return getLatestElement<HTMLElement>(descriptionSelector)
}

function getLatestCloseTrigger() {
  return getLatestElement<HTMLButtonElement>(closeSelector)
}

function getActionButton(action: string) {
  const button = document.querySelector<HTMLButtonElement>(`[data-toast-action="${action}"]`)
  if (!button)
    throw new Error(`Expected toast action button: ${action}`)
  return button
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function clickAction(action: string) {
  getActionButton(action).click()
}

function getToastCount() {
  return document.querySelectorAll(rootSelector).length
}

async function expectToastCount(expected: number) {
  await vi.waitFor(() => getToastCount() === expected, { timeout: 2000 })
  expect(getToastCount()).toBe(expected)
}

describe('[toast] browser tests', () => {
  beforeEach(() => {
    if (mountEl) {
      document.body.removeChild(mountEl)
    }
    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
    render(mountEl)
  })

  it('creates info toast with expected content', async () => {
    await clickAction('info')

    await expectToastCount(1)

    const root = getLatestToastRoot()
    expect(root.dataset.type).toBe('info')
    expect(root.dataset.placement).toBe('bottom-end')

    expect(getLatestTitle().textContent).toBe('Heads up')
    expect(getLatestDescription().textContent).toBe('Your workspace was moved to the new region.')
  })

  it('renders success toast with success styling', async () => {
    await clickAction('success')

    await expectToastCount(1)

    const root = getLatestToastRoot()
    expect(root.dataset.type).toBe('success')
    expect(getLatestTitle().textContent).toBe('Payment complete')
  })

  it('close trigger dismisses the toast', async () => {
    await clickAction('info')

    await expectToastCount(1)

    getLatestCloseTrigger().click()
    await wait(500)

    await expectToastCount(0)
  })

  it('dismiss all removes every toast', async () => {
    await clickAction('info')
    await clickAction('error')

    await expectToastCount(2)

    await clickAction('dismiss')
    await wait(500)

    await expectToastCount(0)
  })

  it('respects max toast count from controls', async () => {
    for (let i = 0; i < 6; i++) {
      await clickAction('info')
    }

    await expectToastCount(5)
  })

  it('promise toast resolves to success', async () => {
    vi.useFakeTimers()
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9)

    try {
      await clickAction('promise')

      await expectToastCount(1)

      const root = getLatestToastRoot()
      expect(root.dataset.type).toBe('loading')

      await vi.advanceTimersByTimeAsync(1600)
      await Promise.resolve()

      expect(root.dataset.type).toBe('success')
      expect(getLatestTitle().textContent).toBe('All caught up')
    }
    finally {
      randomSpy.mockRestore()
      vi.useRealTimers()
    }
  })

  it('promise toast rejects to error', async () => {
    vi.useFakeTimers()
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.1)

    try {
      await clickAction('promise')

      await expectToastCount(1)

      const root = getLatestToastRoot()
      expect(root.dataset.type).toBe('loading')

      await vi.advanceTimersByTimeAsync(1600)
      await Promise.resolve()

      expect(root.dataset.type).toBe('error')
      expect(getLatestTitle().textContent).toBe('Sync failed')
      expect(getLatestDescription().textContent).toBe('Server rejected the update.')
    }
    finally {
      randomSpy.mockRestore()
      vi.useRealTimers()
    }
  })
})
