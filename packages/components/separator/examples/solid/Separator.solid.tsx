/** @jsxImportSource solid-js */
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For, Show } from 'solid-js'
import * as separator from '../../index'
import '../style.css'

const navItems = [
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
]

export default function Separator() {
  const [state, send] = useMachine(separator.machine({ id: createUniqueId() }))
  const api = createMemo(() => separator.connect(state, send, normalizeProps))

  return (
    <Layout>
      <section class="separator-example">
        <header class="separator-example__header">
          <p class="separator-example__title">Destyler UI</p>
          <p class="separator-example__subtitle">Unstyled components for Solid.</p>
        </header>

        <div
          class="separator-line separator-example__divider"
          {...api().getRootProps()}
        />

        <nav class="separator-example__nav" aria-label="Secondary">
          <For each={navItems}>
            {(item, index) => (
              <>
                <span class="separator-example__nav-item">{item.label}</span>
                <Show when={index() < navItems.length - 1}>
                  <div
                    class="separator-line separator-example__divider--vertical"
                    {...api().getRootProps('vertical')}
                  />
                </Show>
              </>
            )}
          </For>
        </nav>
      </section>

      <Toolbar viz>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
