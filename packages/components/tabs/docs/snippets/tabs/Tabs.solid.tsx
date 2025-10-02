/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tabs from '@destyler/tabs'
import { createMemo, createUniqueId } from 'solid-js'
import Account from './Account.solid.tsx'
import Password from './Password.solid.tsx'
import '@docs/styles/components/tabs.css'

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
    <div {...api().getRootProps()}>
      <div {...api().getListProps()}>
        {data.map(item => (
          <button {...api().getTriggerProps({ value: item.value })}>
            {item.label}
          </button>
        ))}
      </div>
      {data.map(item => (
        <div {...api().getContentProps({ value: item.value })}>
          <p class="text-sm text-muted-foreground">
            <item.component />
          </p>
        </div>
      ))}
    </div>
  )
}
