import { normalizeProps, useMachine } from '@destyler/react'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { Fragment, useId } from 'react'
import * as separator from '../../index'
import '../style.css'

const navItems = [
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
]

export default function Separator() {
  const [state, send] = useMachine(separator.machine({ id: useId() }))
  const api = separator.connect(state, send, normalizeProps)

  return (
    <Layout>
      <section className="separator-example">
        <header className="separator-example__header">
          <p className="separator-example__title">Destyler UI</p>
          <p className="separator-example__subtitle">Unstyled components for React.</p>
        </header>

        <div
          {...api.getRootProps()}
          className="separator-line separator-example__divider"
        />

        <nav className="separator-example__nav" aria-label="Secondary">
          {navItems.map((item, index) => (
            <Fragment key={item.value}>
              <span className="separator-example__nav-item">{item.label}</span>
              {index < navItems.length - 1 && (
                <div
                  {...api.getRootProps('vertical')}
                  className="separator-line separator-example__divider--vertical"
                />
              )}
            </Fragment>
          ))}
        </nav>
      </section>

      <Toolbar viz>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
