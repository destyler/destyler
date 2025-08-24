/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tabs from '@destyler/tabs'
import { createMemo, createUniqueId } from 'solid-js'
import Account from './Account.tsx'
import Password from './Password.tsx'
import './index.css'

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
    <div {...api().getRootProps()} class="tabs-root">
      <div
        {...api().getListProps()}
        class="tabs-list"
      >
        {data.map(item => (
          <button
            {...api().getTriggerProps({ value: item.value })}
            class="tabs-trigger"
          >
            {item.label}
          </button>
        ))}
      </div>
      {data.map(item => (
        <div
          {...api().getContentProps({ value: item.value })}
          class="tabs-content"
        >
          <item.component />
        </div>
      ))}
    </div>
  )
}
