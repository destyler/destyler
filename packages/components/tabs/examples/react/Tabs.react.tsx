import { normalizeProps, useMachine } from '@destyler/react'
import { tabsControls, tabsData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as tabs from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(tabsControls)

  const [state, send] = useMachine(
    tabs.machine({
      id: useId(),
      value: 'nils',
    }),
    {
      context: controls.context,
    },
  )

  const api = tabs.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <div {...api.getIndicatorProps()} />
          <div {...api.getListProps()}>
            {tabsData.map(data => (
              <button {...api.getTriggerProps({ value: data.id })} key={data.id} data-testid={`${data.id}-tab`}>
                {data.label}
              </button>
            ))}
          </div>
          {tabsData.map(data => (
            <div {...api.getContentProps({ value: data.id })} key={data.id} data-testid={`${data.id}-tab-panel`}>
              <p>{data.content}</p>
              {data.id === 'agnes' ? <input placeholder="Agnes" /> : null}
            </div>
          ))}
        </div>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
