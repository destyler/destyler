/** @jsxImportSource solid-js */
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function Pagination() {
  const [state, send] = useMachine(pagination.machine({
    id: createUniqueId(),
    count: 1000,
  }))

  const api = createMemo(() => pagination.connect(state, send, normalizeProps))

  return (
    <nav {...api().getRootProps()}>
      <ul>
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
  )
}
