import * as pagination from '@destyler/pagination'
import { paginationControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function Pagination() {
  const controls = useControls(paginationControls)

  const [state, send] = useMachine(pagination.machine({ id: createUniqueId(), count: 1000 }), {
    context: controls.context,
  })

  const api = createMemo(() => pagination.connect(state, send, normalizeProps))

  return (
    <>
      <nav {...api().getRootProps()} class="flex justify-center py-8">
        <ul class="flex items-center gap-x-3">
          <li>
            <a
              {...api().getPrevTriggerProps()}
              class="px-5 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-x-1 text-sm font-medium cursor-pointer"
            >
              <div class="w-4 h-4 i-carbon:chevron-left" />
              Previous
              {' '}
              <span class="sr-only">Page</span>
            </a>
          </li>
          {api().pages.map((page, i) => (
            <li>
              {page.type === 'page'
                ? (
                    <a
                      {...api().getItemProps(page)}
                      class="min-w-[40px] h-10 flex items-center justify-center px-3 rounded-lg border border-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md data-[selected]:bg-gray-900 data-[selected]:text-white data-[selected]:border-gray-900 data-[selected]:shadow-lg text-sm font-medium cursor-pointer"
                    >
                      {page.value}
                    </a>
                  )
                : (
                    <span
                      {...api().getEllipsisProps({ index: i })}
                      class="px-3 py-2 text-gray-500 font-medium"
                    >
                      &#8230;
                    </span>
                  )}
            </li>
          ))}
          <li>
            <a
              {...api().getNextTriggerProps()}
              class="px-5 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-x-1 text-sm font-medium cursor-pointer"
            >
              Next
              {' '}
              <span class="sr-only">Page</span>
              <div class="w-4 h-4 i-carbon:chevron-right" />
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
