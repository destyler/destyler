import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function Pagination() {
  const [state, send] = useMachine(pagination.machine({
    id: useId(),
    count: 1000,
  }))

  const api = pagination.connect(state, send, normalizeProps)

  return (
    <nav {...api.getRootProps()}>
      <ul>
        <li>
          <a {...api.getPrevTriggerProps()}>
            <div />
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
            <div />
          </a>
        </li>
      </ul>
    </nav>
  )
}
