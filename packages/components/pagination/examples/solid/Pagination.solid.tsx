/** @jsxImportSource solid-js */
import { paginationControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as pagination from '../../index'
import '../style.css'

export default function Pagination() {
  const controls = useControls(paginationControls)

  const [state, send] = useMachine(pagination.machine({
    id: createUniqueId(),
    count: 1000,
  }), {
    context: controls.context,
  })

  const api = createMemo(() => pagination.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <nav {...api().getRootProps()}>
          <ul style={{ display: 'flex' }}>
            <li>
              <a {...api().getPrevTriggerProps()}>
                <div />
              </a>
            </li>
            {api().pages.map((page, i) => (
              <li>
                {page.type === 'page'
                  ? (
                      <a {...api().getItemProps(page)}>
                        {page.value}
                      </a>
                    )
                  : (
                      <span {...api().getEllipsisProps({ index: i })}>
                        &#8230;
                      </span>
                    )}
              </li>
            ))}
            <li>
              <a {...api().getNextTriggerProps()}>
                <div />
              </a>
            </li>
          </ul>
        </nav>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
