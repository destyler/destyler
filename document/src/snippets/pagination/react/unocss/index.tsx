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
    <nav {...api.getRootProps()} className="flex justify-center mt-0!">
      <ul className="flex flex-row items-center gap-1 m-0! list-none!">
        <li>
          <a
            {...api.getPrevTriggerProps()}
            className="no-underline! text-primary! inline-flex cursor-pointer h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <div className="w-4 h-4 i-carbon:chevron-left mr-1" />
            Previous
          </a>
        </li>
        {api.pages.map((page, i) => (
          <li key={page.type === 'page' ? page.value : `ellipsis-${i}`}>
            {page.type === 'page'
            ? (
              <a
                {...api.getItemProps(page)}
                className="no-underline! text-primary! inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground"
              >
                {page.value}
              </a>
            )
            : (
              <span
                {...api.getEllipsisProps({ index: i })}
                className="inline-flex h-9 cursor-pointer w-9 items-center justify-center text-sm font-medium text-muted-foreground!"
              >
                &#8230;
              </span>
            )}
          </li>
        ))}
        <li>
          <a
            {...api.getNextTriggerProps()}
            className="no-underline! text-primary! inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Next
            <div className="w-4 h-4 i-carbon:chevron-right ml-1" />
          </a>
        </li>
      </ul>
    </nav>
  )
}
