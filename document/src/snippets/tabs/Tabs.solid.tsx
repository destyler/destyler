/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tabs from '@destyler/tabs'
import { createMemo, createUniqueId } from 'solid-js'
import Account from './Account.solid.tsx'
import Password from './Password.solid.tsx'

const data = [
  { value: 'account', label: 'Account', component: Account },
  { value: 'password', label: 'Password', component: Password },
]

export default function Tabs() {
  const [state, send] = useMachine(tabs.machine({
    id: createUniqueId(),
    value: 'account',
  }))

  const api = createMemo(() => tabs.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="w-full mt-0!">
      <div
        {...api().getListProps()}
        class="inline-flex h-10 w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      >
        {data.map(item => (
          <button
            {...api().getTriggerProps({ value: item.value })}
            class="inline-flex items-center justify-center mt-0! whitespace-nowrap w-1/2 rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm"
          >
            {item.label}
          </button>
        ))}
      </div>
      {data.map(item => (
        <div
          {...api().getContentProps({ value: item.value })}
          class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[hidden]:hidden"
        >
          <p class="text-sm text-muted-foreground">
            <item.component />
          </p>
        </div>
      ))}
    </div>
  )
}
