import { normalizeProps, useMachine } from '@destyler/react'
import { paginationControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as pagination from '../../index'
import '../style.css'

export default function Pagination() {
  const controls = useControls(paginationControls)

  const [state, send] = useMachine(pagination.machine({
    id: useId(),
    count: 1000,
  }), {
    context: controls.context,
  })

  const api = pagination.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <nav {...api.getRootProps()}>
          <ul style={{ display: 'flex' }}>
            <li>
              <a {...api.getPrevTriggerProps()}>
                ⬅️
              </a>
            </li>
            {api.pages.map((page, i) => (
              <li key={page.type === 'page' ? page.value : `ellipsis-${i}`}>
                {page.type === 'page'
                  ? (
                      <a {...api.getItemProps(page)}>
                        {page.value}
                      </a>
                    )
                  : (
                      <span {...api.getEllipsisProps({ index: i })}>
                        &#8230;
                      </span>
                    )}
              </li>
            ))}
            <li>
              <a {...api.getNextTriggerProps()}>
                ➡️
              </a>
            </li>
          </ul>
        </nav>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
