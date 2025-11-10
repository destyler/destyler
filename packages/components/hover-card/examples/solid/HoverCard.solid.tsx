/** @jsxImportSource solid-js */
import { hoverCardControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

import * as hoverCard from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(hoverCardControls)

  const [state, send] = useMachine(hoverCard.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => hoverCard.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div style={{ display: 'flex', gap: '50px' }}>
          <a href="https://twitter.com/zag_js" target="_blank" {...api().getTriggerProps()}>
            Twitter
          </a>
          <Show when={api().open}>
            <Portal>
              <div {...api().getPositionerProps()}>
                <div {...api().getContentProps()}>
                  <div {...api().getArrowProps()}>
                    <div {...api().getArrowTipProps()} />
                  </div>
                  Twitter Preview
                  <a href="https://twitter.com/zag_js" target="_blank">
                    Twitter
                  </a>
                </div>
              </div>
            </Portal>
          </Show>
          <div data-part="test-text">Test text</div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
