import { normalizeProps, useMachine } from '@destyler/react'
import * as tabs from '@destyler/tabs'
import { useId } from 'react'
import Account from './Account.tsx'
import Password from './Password.tsx'
import './index.css'

const data = [
  { value: 'account', label: 'Account', component: Account },
  { value: 'password', label: 'Password', component: Password },
]

export default function Tabs() {
  const [state, send] = useMachine(tabs.machine({
    id: useId(),
    value: 'account', 
  }))

  const api = tabs.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="tabs-root">
      <div
        {...api.getListProps()}
        className="tabs-list"
      >
        {data.map(item => (
          <button
            key={item.value}
            {...api.getTriggerProps({ value: item.value })}
            className="tabs-trigger"
          >
            {item.label}
          </button>
        ))}
      </div>
      {data.map(item => (
        <div
          key={item.value}
          {...api.getContentProps({ value: item.value })}
          className="tabs-content"
        >
          <item.component />
        </div>
      ))}
    </div>
  )
}
