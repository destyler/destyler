/** @jsxImportSource solid-js */
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Pagination() {
  const [state, send] = useMachine(pagination.machine({
    id: createUniqueId(),
    count: 1000,
  }))

  const api = createMemo(() => pagination.connect(state, send, normalizeProps))

  return (
    <nav {...api().getRootProps()} class="pagination-nav">
      <ul class="pagination-list">
        <li>
          <a
            {...api().getPrevTriggerProps()}
            class="pagination-button pagination-prev"
          >
            <div class="pagination-icon pagination-prev-icon i-carbon:chevron-left" />
            Previous
          </a>
        </li>
        {api().pages.map((page, i) => (
          <li>
            {page.type === 'page'
              ? (
                  <a
                    {...api().getItemProps(page)}
                    class="pagination-button pagination-page"
                  >
                    {page.value}
                  </a>
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
            class="pagination-button pagination-next"
          >
            Next
            <div class="pagination-icon pagination-next-icon i-carbon:chevron-right" />
          </a>
        </li>
      </ul>
    </nav>
  )
}
