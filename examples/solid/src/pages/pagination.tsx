/** @jsxImportSource solid-js */
import * as pagination from '@destyler/pagination'
import { paginationControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/pagination.css'

export default function Pagination() {
  const controls = useControls(paginationControls)
  const [state, send] = useMachine(pagination.machine({ id: createUniqueId(), count: 1000 }), {
    context: controls.context,
  })
  const api = createMemo(() => pagination.connect(state, send, normalizeProps))

  return (
    <>
      <nav {...api().getRootProps()} class="pagination-root">
        <ul class="pagination-list">
          <li>
            <a
              {...api().getPrevTriggerProps()}
              class="pagination-btn"
              data-testid="prev:trigger"
            >
              <div class="pagination-icon i-carbon:chevron-left" />
              Previous
              {' '}
              <span class="sr-only">Page</span>
            </a>
          </li>
          {api().pages.map((page, i) => (
            <li>
              {page.type === 'page'
                ? (
                    <button
                      {...api().getItemProps(page)}
                      class="pagination-page"
                      data-testid={`pagination-item-${page.value}`}
                    >
                      {page.value}
                    </button>
                  )
                : (
                    <span
                      {...api().getEllipsisProps({ index: i })}
                      class="pagination-ellipsis"
                    >
                      &#8230;
                    </span>
                  )}
            </li>
          ))}
          <li>
            <a
              {...api().getNextTriggerProps()}
              class="pagination-btn"
              data-testid="next:trigger"
            >
              Next
              {' '}
              <span class="sr-only">Page</span>
              <div class="pagination-icon i-carbon:chevron-right" />
            </a>
          </li>
        </ul>
      </nav>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
