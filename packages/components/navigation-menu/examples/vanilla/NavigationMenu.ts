import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as NavigationMenuState } from '../../src/types'
import { navigationMenuControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as navigationMenu from '../../index'
import '../style.css'

type NavigationMenuMachineContext = ContextFrom<typeof navigationMenu.machine>

class NavigationMenuExample extends Component<
  navigationMenu.Context,
  navigationMenu.Api,
  NavigationMenuMachineContext,
  MachineState
> {
  private readonly rootEl: HTMLElement | null
  private readonly listEl: HTMLUListElement | null
  private readonly viewportPositionerEl: HTMLDivElement | null
  private readonly itemElements: Map<string, HTMLLIElement> = new Map()
  private readonly triggerElements: Map<string, HTMLButtonElement> = new Map()
  private viewportEl: HTMLDivElement | null = null
  private contentElements: Map<string, HTMLDivElement> = new Map()
  private linkElements: Map<string, HTMLAnchorElement> = new Map()
  private readonly stateListeners = new Set<(state: NavigationMenuState) => void>()
  private wasOpen = false

  constructor(rootEl: HTMLElement, context: navigationMenu.Context, options?: any) {
    super(rootEl, context, options)
    this.rootEl = rootEl.querySelector('[data-navigation-menu-root]')
    this.listEl = rootEl.querySelector('[data-navigation-menu-list]')
    this.viewportPositionerEl = rootEl.querySelector('[data-viewport-positioner]')

    const items = ['getting-started', 'components', 'docs']
    items.forEach((value) => {
      const itemEl = rootEl.querySelector<HTMLLIElement>(`[data-item="${value}"]`)
      const triggerEl = rootEl.querySelector<HTMLButtonElement>(`[data-trigger="${value}"]`)
      const linkEl = rootEl.querySelector<HTMLAnchorElement>(`[data-link="${value}"]`)

      if (itemEl)
        this.itemElements.set(value, itemEl)
      if (triggerEl)
        this.triggerElements.set(value, triggerEl)
      if (linkEl)
        this.linkElements.set(value, linkEl)
    })
  }

  initService(context: navigationMenu.Context) {
    return navigationMenu.machine(context) as navigationMenu.Service
  }

  initApi() {
    return navigationMenu.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: NavigationMenuState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: NavigationMenuState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private createViewportContent() {
    if (!this.viewportPositionerEl)
      return

    this.viewportPositionerEl.innerHTML = ''

    const viewportEl = document.createElement('div')
    this.viewportEl = viewportEl
    spreadProps(viewportEl, this.api.getViewportProps())
    this.viewportPositionerEl.appendChild(viewportEl)

    // Create getting-started content
    const gettingStartedContent = document.createElement('div')
    spreadProps(gettingStartedContent, this.api.getContentProps({ value: 'getting-started' }))
    this.contentElements.set('getting-started', gettingStartedContent)
    gettingStartedContent.innerHTML = `
      <ul class="nav-content-list">
        <li class="nav-content-item-featured">
          <a href="#" class="nav-featured-link" data-link="radix">
            <div class="nav-featured-icon">🎨</div>
            <div class="nav-featured-title">shadcn/ui</div>
            <p class="nav-featured-desc">Beautifully designed components built with Radix UI and Tailwind CSS.</p>
          </a>
        </li>
        <li><a href="#" class="nav-link-item" data-link="intro"><div class="nav-link-title">Introduction</div><p class="nav-link-desc">Re-usable components built using Radix UI and Tailwind CSS.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="install"><div class="nav-link-title">Installation</div><p class="nav-link-desc">How to install dependencies and structure your app.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="typography"><div class="nav-link-title">Typography</div><p class="nav-link-desc">Styles for headings, paragraphs, lists...etc</p></a></li>
      </ul>
    `
    viewportEl.appendChild(gettingStartedContent)

    // Create components content
    const componentsContent = document.createElement('div')
    spreadProps(componentsContent, this.api.getContentProps({ value: 'components' }))
    this.contentElements.set('components', componentsContent)
    componentsContent.innerHTML = `
      <ul class="nav-content-grid">
        <li><a href="#" class="nav-link-item" data-link="alert-dialog"><div class="nav-link-title">Alert Dialog</div><p class="nav-link-desc">A modal dialog that interrupts the user.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="hover-card"><div class="nav-link-title">Hover Card</div><p class="nav-link-desc">For sighted users to preview content.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="progress"><div class="nav-link-title">Progress</div><p class="nav-link-desc">Displays an indicator of progress.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="scroll-area"><div class="nav-link-title">Scroll-area</div><p class="nav-link-desc">Visually or semantically separates content.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="tabs"><div class="nav-link-title">Tabs</div><p class="nav-link-desc">A set of layered sections of content.</p></a></li>
        <li><a href="#" class="nav-link-item" data-link="tooltip"><div class="nav-link-title">Tooltip</div><p class="nav-link-desc">A popup that displays information.</p></a></li>
      </ul>
    `
    viewportEl.appendChild(componentsContent)

    // Apply link props to all links
    const allLinks = viewportEl.querySelectorAll<HTMLAnchorElement>('[data-link]')
    allLinks.forEach((linkEl) => {
      const value = linkEl.getAttribute('data-link')
      if (value) {
        spreadProps(linkEl, this.api.getLinkProps({ value }))
        this.linkElements.set(value, linkEl)
      }
    })
  }

  private removeViewportContent() {
    if (this.viewportPositionerEl) {
      this.viewportPositionerEl.innerHTML = ''
    }
    this.viewportEl = null
    this.contentElements.clear()
    // Keep the top-level links (docs)
    const docsLink = this.linkElements.get('docs')
    this.linkElements.clear()
    if (docsLink)
      this.linkElements.set('docs', docsLink)
  }

  render = () => {
    const api = this.api
    const isOpen = api.open

    if (this.rootEl)
      spreadProps(this.rootEl, api.getRootProps())

    if (this.listEl)
      spreadProps(this.listEl, api.getListProps())

    this.itemElements.forEach((el, value) => {
      spreadProps(el, api.getItemProps({ value }))
    })

    this.triggerElements.forEach((el, value) => {
      spreadProps(el, api.getTriggerProps({ value }))
    })

    // Handle docs link
    const docsLink = this.linkElements.get('docs')
    if (docsLink) {
      spreadProps(docsLink, api.getLinkProps({ value: 'docs' }))
    }

    // Handle viewport positioner
    if (this.viewportPositionerEl)
      spreadProps(this.viewportPositionerEl, api.getViewportPositionerProps())

    // Handle viewport creation/removal
    if (isOpen && !this.wasOpen) {
      this.createViewportContent()
    }
    else if (!isOpen && this.wasOpen) {
      this.removeViewportContent()
    }

    // Update existing viewport content
    if (this.viewportEl) {
      spreadProps(this.viewportEl, api.getViewportProps())
    }

    this.contentElements.forEach((el, value) => {
      spreadProps(el, api.getContentProps({ value }))
    })

    this.wasOpen = isOpen
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(navigationMenuControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main data-navigation-menu-example>
      <nav data-navigation-menu-root>
        <ul data-navigation-menu-list>
          <li data-item="getting-started">
            <button data-trigger="getting-started">Getting started</button>
          </li>
          <li data-item="components">
            <button data-trigger="components">Components</button>
          </li>
          <li data-item="docs">
            <a data-link="docs" href="#">Documentation</a>
          </li>
        </ul>
        <div data-viewport-positioner></div>
      </nav>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-navigation-menu-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new NavigationMenuExample(scope, {
    id: 'navigation-menu:vanilla',
  }, {
    context: {
      get: () => controls.context as Partial<NavigationMenuMachineContext>,
      subscribe: (fn: (ctx: Partial<NavigationMenuMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: NavigationMenuState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as NavigationMenuState)
  instance.onStateChange(updateVisualizer)
}
