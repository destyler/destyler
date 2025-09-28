import { normalizeProps, useMachine } from '@destyler/react'
import * as tabs from '@destyler/tabs'
import { useId } from 'react'
import Account from './Account.react.tsx'
import Password from './Password.react.tsx'
import '../../styles/components/tabs.css'

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
    <div {...api.getRootProps()}>
      <div {...api.getListProps()}>
        {data.map(item => (
          <button key={item.value} {...api.getTriggerProps({ value: item.value })}>
            {item.label}
          </button>
        ))}
      </div>
      {data.map(item => (
        <div key={item.value} {...api.getContentProps({ value: item.value })}>
          <p className="text-sm text-muted-foreground">
            <item.component />
          </p>
        </div>
      ))}
    </div>
  )
}
