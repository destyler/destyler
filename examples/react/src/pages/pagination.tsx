import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/react'
import { paginationControls } from '@destyler/shared-private-private'
import { useId, useMemo } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function Pagination() {
  const controls = useControls(paginationControls)

  const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }), {
    context: controls.context,
  })

  const api = useMemo(() => pagination.connect(state, send, normalizeProps), [state])

  return (
    <>
      <nav {...api.getRootProps()} className="flex justify-center py-8">
        <ul className="flex items-center gap-x-3">
          <li>
            <a
              {...api.getPrevTriggerProps()}
              className="px-5 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-50
              transition-all duration-200 shadow-sm hover:shadow-md
              flex items-center gap-x-1 text-sm font-medium cursor-pointer"
            >
              <div className="w-4 h-4 i-carbon:chevron-left" />
              Previous
              {' '}
              <span className="sr-only">Page</span>
            </a>
          </li>
          {api.pages.map((page, i) => (
            <li key={page.type === 'page' ? page.value : `ellipsis-${i}`}>
              {page.type === 'page'
                ? (
                    <a
                      {...api.getItemProps(page)}
                      className="min-w-[40px] h-10 flex items-center justify-center px-3
                  rounded-lg border border-gray-800 hover:bg-gray-50
                  transition-all duration-200 shadow-sm hover:shadow-md
                  data-[selected]:bg-gray-900 data-[selected]:text-white
                  data-[selected]:border-gray-900 data-[selected]:shadow-lg
                  text-sm font-medium cursor-pointer"
                    >
                      {page.value}
                    </a>
                  )
                : (
                    <span
                      {...api.getEllipsisProps({ index: i })}
                      className="px-3 py-2 text-gray-500 font-medium"
                    >
                      &#8230;
                    </span>
                  )}
            </li>
          ))}
          <li>
            <a
              {...api.getNextTriggerProps()}
              className="px-5 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-50
              transition-all duration-200 shadow-sm hover:shadow-md
              flex items-center gap-x-1 text-sm font-medium cursor-pointer"
            >
              Next
              {' '}
              <span className="sr-only">Page</span>
              <div className="w-4 h-4 i-carbon:chevron-right" />
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
