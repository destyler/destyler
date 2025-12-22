import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { navigationMenuControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as navigationMenu from '../../index'
import styles from '../style.css?inline'

type NavigationMenuMachineContext = ContextFrom<typeof navigationMenu.machine>

@customElement('destyler-navigation-menu')
export class NavigationMenuElement extends LitElement {
  private controls = new ControlsController(navigationMenuControls)

  private machine = new MachineController(
    this,
    navigationMenu.machine({
      id: 'navigation-menu:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<NavigationMenuMachineContext>,
        subscribe: (fn: (ctx: Partial<NavigationMenuMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = navigationMenu.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <nav ${spread(api.getRootProps())}>
            <ul ${spread(api.getListProps())}>
              <li ${spread(api.getItemProps({ value: 'getting-started' }))}>
                <button ${spread(api.getTriggerProps({ value: 'getting-started' }))}>
                  Getting started
                </button>
              </li>
              <li ${spread(api.getItemProps({ value: 'components' }))}>
                <button ${spread(api.getTriggerProps({ value: 'components' }))}>
                  Components
                </button>
              </li>
              <li ${spread(api.getItemProps({ value: 'docs' }))}>
                <a ${spread(api.getLinkProps({ value: 'docs' }))} href="#">Documentation</a>
              </li>
            </ul>

            <div ${spread(api.getViewportPositionerProps())}>
              ${api.open
                ? html`
                  <div ${spread(api.getViewportProps())}>
                    <div ${spread(api.getContentProps({ value: 'getting-started' }))}>
                      <ul class="nav-content-list">
                        <li class="nav-content-item-featured">
                          <a ${spread(api.getLinkProps({ value: 'radix' }))} href="#" class="nav-featured-link">
                            <div class="nav-featured-icon">🎨</div>
                            <div class="nav-featured-title">shadcn/ui</div>
                            <p class="nav-featured-desc">
                              Beautifully designed components built with Radix UI and Tailwind CSS.
                            </p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'intro' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Introduction</div>
                            <p class="nav-link-desc">Re-usable components built using Radix UI and Tailwind CSS.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'install' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Installation</div>
                            <p class="nav-link-desc">How to install dependencies and structure your app.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'typography' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Typography</div>
                            <p class="nav-link-desc">Styles for headings, paragraphs, lists...etc</p>
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div ${spread(api.getContentProps({ value: 'components' }))}>
                      <ul class="nav-content-grid">
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'alert-dialog' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Alert Dialog</div>
                            <p class="nav-link-desc">A modal dialog that interrupts the user.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'hover-card' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Hover Card</div>
                            <p class="nav-link-desc">For sighted users to preview content.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'progress' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Progress</div>
                            <p class="nav-link-desc">Displays an indicator of progress.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'scroll-area' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Scroll-area</div>
                            <p class="nav-link-desc">Visually or semantically separates content.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'tabs' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Tabs</div>
                            <p class="nav-link-desc">A set of layered sections of content.</p>
                          </a>
                        </li>
                        <li>
                          <a ${spread(api.getLinkProps({ value: 'tooltip' }))} href="#" class="nav-link-item">
                            <div class="nav-link-title">Tooltip</div>
                            <p class="nav-link-desc">A popup that displays information.</p>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                `
                : nothing}
            </div>
          </nav>
        </main>
        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-navigation-menu': NavigationMenuElement
  }
}
