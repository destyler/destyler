import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tooltip from '../../index'
import '../style.css'

export default function Page() {
  const id = 'tip-1'
  const id2 = 'tip-2'
  const [state, send] = useMachine(
    tooltip.machine({
      id,
    }),
  )
  const [state2, send2] = useMachine(
    tooltip.machine({
      id: id2,
    }),
  )

  const api = tooltip.connect(state, send, normalizeProps)
  const api2 = tooltip.connect(state2, send2, normalizeProps)
  return (
    <Layout>
      <main className="tooltip">
        <div className="root">
          <>
            <button data-testid={`${id}-trigger`} {...api.getTriggerProps()}>
              Hover me
            </button>
            {api.open && (
              <div {...api.getPositionerProps()}>
                <div className="tooltip-content" data-testid={`${id}-tooltip`} {...api.getContentProps()}>
                  Tooltip
                </div>
              </div>
            )}
          </>
          <button data-testid={`${id2}-trigger`} {...api2.getTriggerProps()}>
            Over me
          </button>
          {api2.open && (
            <Portal>
              <div {...api2.getPositionerProps()}>
                <div className="tooltip-content" data-testid={`${id2}-tooltip`} {...api2.getContentProps()}>
                  Tooltip 2
                </div>
              </div>
            </Portal>
          )}
        </div>
      </main>
      <Toolbar controls={null}>
        <StateVisualizer state={state} label="Tooltip 1" />
        <StateVisualizer state={state2} label="Tooltip 2" />
      </Toolbar>
    </Layout>
  )
}
