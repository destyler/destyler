import { html, nothing, render } from 'lit'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { portal as litPortal } from '../lit/src/components/portal'
import { Portal as ReactPortal } from '../react/src/components/portal'
import { portal as sveltePortal } from '../svelte/src/utils/portal'
import { createPortal as vanillaPortal } from '../vanilla/src/components/portal'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

type Framework = 'react' | 'svelte' | 'vanilla' | 'lit'
interface Options {
  getRootNode?: () => Node
  container?: HTMLElement
  disabled?: boolean
}

const selector = '[data-portal-test]'

async function mount(framework: Framework, options: Options) {
  const host = document.createElement('div')
  document.body.append(host)
  let update!: (next: Options) => void | Promise<void>
  let cleanup!: () => void | Promise<void>

  if (framework === 'react') {
    const root = createRoot(host)
    update = async (next) => {
      await act(async () => root.render(createElement(ReactPortal, {
        ...next,
        container: next.container ? { current: next.container } : undefined,
      }, createElement('span', { 'data-portal-test': '' }, 'portal'))))
    }
    cleanup = async () => act(async () => root.unmount())
  }
  else if (framework === 'lit') {
    update = (next) => {
      render(html`${litPortal(html`<span data-portal-test>portal</span>`, undefined, next)}`, host)
    }
    cleanup = () => {
      render(nothing, host)
    }
  }
  else {
    const node = document.createElement('span')
    node.setAttribute('data-portal-test', '')
    node.textContent = 'portal'
    host.append(node)
    if (framework === 'svelte') {
      let action: ReturnType<typeof sveltePortal> | undefined
      update = (next) => {
        if (action)
          action.update(next)
        else
          action = sveltePortal(node, next)
      }
      cleanup = () => action?.destroy()
    }
    else {
      let unmount = () => {}
      update = (next) => {
        // Vanilla exposes mount/unmount, so move through its public remount flow.
        unmount()
        unmount = vanillaPortal(node, next).mount()
      }
      cleanup = () => unmount()
    }
  }

  try {
    await update(options)
  }
  catch (error) {
    await cleanup()
    host.remove()
    throw error
  }
  return {
    host,
    update,
    async dispose() {
      await cleanup()
      host.remove()
    },
  }
}

function createFrame() {
  const frame = document.createElement('iframe')
  document.body.append(frame)
  const doc = frame.contentDocument!
  const element = doc.createElement('section')
  const shadowHost = doc.createElement('div')
  doc.body.append(element, shadowHost)
  const shadow = shadowHost.attachShadow({ mode: 'open' })
  return { frame, doc, element, shadow }
}

describe.each<Framework>(['react', 'svelte', 'vanilla', 'lit'])('%s portal document ownership', (framework) => {
  it.each(['document', 'element', 'shadow', 'missing', 'undefined', 'null'] as const)('resolves a %s root without crossing documents', async (kind) => {
    const { frame, doc, element, shadow } = createFrame()
    const root = { document: doc, element, shadow, missing: undefined, undefined, null: null }[kind]
    const options = kind === 'missing' ? {} : { getRootNode: () => root as Node }
    const target = kind === 'document'
      ? doc.body
      : kind === 'element' || kind === 'shadow'
        ? framework === 'lit' ? root as HTMLElement | ShadowRoot : doc.body
        : document.body
    let view: Awaited<ReturnType<typeof mount>> | undefined
    try {
      view = await mount(framework, options)
      await expect.poll(() => target.querySelector(selector)?.textContent).toBe('portal')
      expect(target.querySelector(selector)?.ownerDocument).toBe(target.ownerDocument)
    }
    finally {
      await view?.dispose()
      expect(target.querySelector(selector)).toBeNull()
      frame.remove()
    }
  })

  it('prefers an explicit container and cleans up when moving targets', async () => {
    const { frame, doc, element } = createFrame()
    const explicit = document.createElement('section')
    document.body.append(explicit)
    const view = await mount(framework, { getRootNode: () => doc, container: explicit })
    try {
      await expect.poll(() => explicit.querySelector(selector)?.textContent).toBe('portal')
      expect(doc.querySelector(selector)).toBeNull()
      await view.update({ getRootNode: () => doc, container: element })
      await expect.poll(() => element.querySelector(selector)?.textContent).toBe('portal')
      expect(explicit.querySelector(selector)).toBeNull()
      expect(element.querySelector(selector)?.ownerDocument).toBe(doc)
    }
    finally {
      await view.dispose()
      expect(element.querySelector(selector)).toBeNull()
      expect(explicit.querySelector(selector)).toBeNull()
      explicit.remove()
      frame.remove()
    }
  })

  it('keeps disabled content inline without resolving a root', async () => {
    const getRootNode = vi.fn(() => document)
    const view = await mount(framework, { getRootNode, disabled: true })
    try {
      expect(view.host.querySelector(selector)?.textContent).toBe('portal')
      expect(getRootNode).not.toHaveBeenCalled()
    }
    finally {
      await view.dispose()
    }
  })
})
