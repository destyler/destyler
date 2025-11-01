import { normalizeProps, useMachine } from '@destyler/react'
import { collapseControls, collapseData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as collapse from '../../index'
import '../style.css'

export default function Collapse() {
  const controls = useControls(collapseControls)

  const [state, send] = useMachine(collapse.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = collapse.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          {collapseData.map((item) => {
            return (
              <div key={item.id} {...api.getItemProps({ value: item.id })}>
                <h3>
                  <button data-testid={`${item.id}:trigger`} {...api.getItemTriggerProps({ value: item.id })}>
                    {item.title}
                    <div {...api.getItemIndicatorProps({ value: item.id })}>
                      &gt;
                    </div>
                  </button>
                </h3>
                <div {...api.getItemContentProps({ value: item.id })} data-testid={`${item.id}:content`}>
                  {item.content}
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
