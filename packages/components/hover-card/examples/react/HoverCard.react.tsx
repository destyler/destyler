import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { hoverCardControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as hoverCard from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(hoverCardControls)

  const [state, send] = useMachine(
    hoverCard.machine({
      id: useId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = hoverCard.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div style={{ display: 'flex', gap: '50px' }}>
          <a href="https://twitter.com/elonehoo" target="_blank" {...api.getTriggerProps()}>
            Twitter
          </a>

          {api.open && (
            <Portal>
              <div {...api.getPositionerProps()}>
                <div {...api.getContentProps()}>
                  <div {...api.getArrowProps()}>
                    <div {...api.getArrowTipProps()} />
                  </div>
                  Twitter Preview
                  <a href="https://twitter.com/elonehoo" target="_blank">
                    Twitter
                  </a>
                </div>
              </div>
            </Portal>
          )}

          <div data-part="test-text">Test text</div>
        </div>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
