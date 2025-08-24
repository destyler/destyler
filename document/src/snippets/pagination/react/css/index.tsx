import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Pagination() {
  const [state, send] = useMachine(pagination.machine({
    id: useId(),
    count: 1000, 
  }))

  const api = pagination.connect(state, send, normalizeProps)

  return (
    <nav {...api.getRootProps()} className="pagination-nav">
      <ul className="pagination-list">
        <li>
          <a
            {...api.getPrevTriggerProps()}
            className="pagination-button pagination-prev"
          >
            <div className="pagination-icon pagination-prev-icon i-carbon:chevron-left" />
            Previous
          </a>
        </li>
        {api.pages.map((page, i) => (
          <li key={page.type === 'page' ? page.value : `ellipsis-${i}`}>
            {page.type === 'page'
            ? (
              <a
                {...api.getItemProps(page)}
                className="pagination-button pagination-page"
              >
                {page.value}
              </a>
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
            className="pagination-button pagination-next"
          >
            Next
            <div className="pagination-icon pagination-next-icon i-carbon:chevron-right" />
          </a>
        </li>
      </ul>
    </nav>
  )
}
