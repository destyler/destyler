import { normalizeProps, useMachine } from '@destyler/react'
import * as tabs from '@destyler/tabs'
import { useId } from 'react'
import Account from './Account.react.tsx'
import Password from './Password.react.tsx'

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
    <div {...api.getRootProps()} className="w-full mt-0!">
      <div
        {...api.getListProps()}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      >
        {data.map(item => (
          <button
            key={item.value}
            {...api.getTriggerProps({ value: item.value })}
            className="inline-flex items-center mt-0! justify-center whitespace-nowrap w-1/2 rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm"
          >
            {item.label}
          </button>
        ))}
      </div>
      {data.map(item => (
        <div
          key={item.value}
          {...api.getContentProps({ value: item.value })}
          className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[hidden]:hidden"
        >
          <p className="text-sm text-muted-foreground">
            <item.component />
          </p>
        </div>
      ))}
    </div>
  )
}
