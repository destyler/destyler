import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/react'
import { paginationControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId, useMemo } from 'react'
import '@destyler/shared-private/styles/pagination.css'

export default function Pagination() {
  const controls = useControls(paginationControls)
  const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }), {
    context: controls.context,
  })
  const api = useMemo(() => pagination.connect(state, send, normalizeProps), [state])

  return (
    <>
      <nav {...api.getRootProps()} className="pagination-root">
        <ul className="pagination-list">
          <li>
            <a
              {...api.getPrevTriggerProps()}
              className="pagination-btn"
              data-testid="prev:trigger"
            >
              <div className="pagination-icon i-carbon:chevron-left" />
              Previous
              {' '}
              <span className="sr-only">Page</span>
            </a>
          </li>
          {api.pages.map((page, i) => (
            <li key={page.type === 'page' ? page.value : `ellipsis-${i}`}>
              {page.type === 'page'
                ? (
                    <button
                      {...api.getItemProps(page)}
                      className="pagination-page"
                      data-testid={`pagination-item-${page.value}`}
                    >
                      {page.value}
                    </button>
                  )
                : (
                    <span
                      {...api.getEllipsisProps({ index: i })}
                      className="pagination-ellipsis"
                    >
                      &#8230;
                    </span>
                  )}
            </li>
          ))}
          <li>
            <a
              {...api.getNextTriggerProps()}
              className="pagination-btn"
              data-testid="next:trigger"
            >
              Next
              {' '}
              <span className="sr-only">Page</span>
              <div className="pagination-icon i-carbon:chevron-right" />
            </a>
          </li>
        </ul>
      </nav>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
