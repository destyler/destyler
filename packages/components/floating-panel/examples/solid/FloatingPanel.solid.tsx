/** @jsxImportSource solid-js */
import { floatingPanelControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as floatingPanel from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(floatingPanelControls)

  const [state, send] = useMachine(floatingPanel.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })

  const api = createMemo(() => floatingPanel.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div>
          <button {...api().getTriggerProps()}>Toggle Panel</button>
          <div {...api().getPositionerProps()}>
            <div {...api().getContentProps()}>
              <div {...api().getDragTriggerProps()}>
                <div {...api().getHeaderProps()}>
                  <p {...api().getTitleProps()}>Floating Panel</p>
                  <div data-scope="floating-panel" data-part="trigger-group">
                    <button {...api().getMinimizeTriggerProps()}>
                      _
                    </button>
                    <button {...api().getMaximizeTriggerProps()}>
                      +
                    </button>
                    <button {...api().getRestoreTriggerProps()}>
                      &#9633;
                    </button>
                    <button {...api().getCloseTriggerProps()}>
                      x
                    </button>
                  </div>
                </div>
              </div>
              <div {...api().getBodyProps()}>
                <p>Some content</p>
              </div>

              <div {...api().getResizeTriggerProps({ axis: 'n' })} />
              <div {...api().getResizeTriggerProps({ axis: 'e' })} />
              <div {...api().getResizeTriggerProps({ axis: 'w' })} />
              <div {...api().getResizeTriggerProps({ axis: 's' })} />
              <div {...api().getResizeTriggerProps({ axis: 'ne' })} />
              <div {...api().getResizeTriggerProps({ axis: 'se' })} />
              <div {...api().getResizeTriggerProps({ axis: 'sw' })} />
              <div {...api().getResizeTriggerProps({ axis: 'nw' })} />
            </div>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
