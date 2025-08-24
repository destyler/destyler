/** @jsxImportSource solid-js */
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'

export default function Breadcrumbs() {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Components', href: '/components/checkbox' },
    { id: '3', label: 'Breadcrumbs' },
  ]

  const [state, send] = useMachine(
    breadcrumbs.machine({
      id: createUniqueId(),
      items,
    }),
  )

  const api = createMemo(() => breadcrumbs.connect(state, send, normalizeProps))

  return (
    <nav {...api().getRootProps()}>
      <ol {...api().getListProps()} class="mt-0! flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        <For each={api().items}>
          {item => (
            <li {...api().getItemProps(item)} class="inline-flex items-center gap-1.5 mt-0!">
              <a {...api().getLinkProps(item)} class="transition-colors hover:text-foreground no-underline! data-[current=page]:text-foreground">
                {item.label}
              </a>
              {item.href && <span {...api().getSeparatorProps()} class="i-carbon:chevron-right size-3"></span>}
            </li>
          )}
        </For>
      </ol>
    </nav>
  )
}
