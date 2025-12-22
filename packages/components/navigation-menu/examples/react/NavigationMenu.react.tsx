import { normalizeProps, useMachine } from '@destyler/react'
import { navigationMenuControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as navigationMenu from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(navigationMenuControls)
  const [state, send] = useMachine(navigationMenu.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = navigationMenu.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <nav {...api.getRootProps()}>
          <ul {...api.getListProps()}>
            <li {...api.getItemProps({ value: 'getting-started' })}>
              <button {...api.getTriggerProps({ value: 'getting-started' })}>
                Getting started
              </button>
            </li>
            <li {...api.getItemProps({ value: 'components' })}>
              <button {...api.getTriggerProps({ value: 'components' })}>
                Components
              </button>
            </li>
            <li {...api.getItemProps({ value: 'docs' })}>
              <a {...api.getLinkProps({ value: 'docs' })} href="#">
                Documentation
              </a>
            </li>
          </ul>

          <div {...api.getViewportPositionerProps()}>
            {api.open && (
              <div {...api.getViewportProps()}>
                <div {...api.getContentProps({ value: 'getting-started' })}>
                  <ul className="nav-content-list">
                    <li className="nav-content-item-featured">
                      <a {...api.getLinkProps({ value: 'radix' })} href="#" className="nav-featured-link">
                        <div className="nav-featured-icon">🎨</div>
                        <div className="nav-featured-title">shadcn/ui</div>
                        <p className="nav-featured-desc">
                          Beautifully designed components built with Radix UI and Tailwind CSS.
                        </p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'intro' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Introduction</div>
                        <p className="nav-link-desc">Re-usable components built using Radix UI and Tailwind CSS.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'install' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Installation</div>
                        <p className="nav-link-desc">How to install dependencies and structure your app.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'typography' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Typography</div>
                        <p className="nav-link-desc">Styles for headings, paragraphs, lists...etc</p>
                      </a>
                    </li>
                  </ul>
                </div>

                <div {...api.getContentProps({ value: 'components' })}>
                  <ul className="nav-content-grid">
                    <li>
                      <a {...api.getLinkProps({ value: 'alert-dialog' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Alert Dialog</div>
                        <p className="nav-link-desc">A modal dialog that interrupts the user.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'hover-card' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Hover Card</div>
                        <p className="nav-link-desc">For sighted users to preview content.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'progress' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Progress</div>
                        <p className="nav-link-desc">Displays an indicator of progress.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'scroll-area' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Scroll-area</div>
                        <p className="nav-link-desc">Visually or semantically separates content.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'tabs' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Tabs</div>
                        <p className="nav-link-desc">A set of layered sections of content.</p>
                      </a>
                    </li>
                    <li>
                      <a {...api.getLinkProps({ value: 'tooltip' })} href="#" className="nav-link-item">
                        <div className="nav-link-title">Tooltip</div>
                        <p className="nav-link-desc">A popup that displays information.</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
