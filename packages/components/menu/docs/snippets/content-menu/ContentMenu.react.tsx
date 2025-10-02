import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import '@docs/styles/components/content-menu.css'

interface MenuItem {
  value: string
  label: string
  icon: string
  shortcut?: string
  disabled?: boolean
}

export default function Menu() {
  const [state, send] = useMachine(menu.machine({
    'id': useId(),
    'aria-label': 'File',
  }))
  const api = menu.connect(state, send, normalizeProps)

  const items: MenuItem[][] = [
    [
      {
        value: 'profile',
        label: 'Profile',
        icon: 'i-lucide-user',
        shortcut: '⇧⌘P',
      },
      {
        value: 'billing',
        label: 'Billing',
        icon: 'i-lucide-credit-card',
        shortcut: '⌘B',
      },
      {
        value: 'settings',
        label: 'Settings',
        icon: 'i-lucide-settings',
        shortcut: '⌘S',
      },
      {
        value: 'feature',
        icon: 'i-lucide-sparkles',
        label: 'Feature',
      },
      {
        value: 'keyboard-shortcuts',
        label: 'Keyboard Shortcuts',
        icon: 'i-lucide-keyboard',
        shortcut: '⌘K',
      },
    ],
    [
      {
        value: 'team',
        icon: 'i-lucide-users',
        label: 'Team',
      },
      {
        value: 'invite-users',
        icon: 'i-lucide-user-plus',
        label: 'Invite Users',
      },
      {
        value: 'new-team',
        icon: 'i-lucide-plus',
        label: 'New Team',
        shortcut: '⌘+T',
      },
    ],
    [
      {
        value: 'github',
        icon: 'i-lucide-github',
        label: 'GitHub',
      },
      {
        value: 'support',
        icon: 'i-lucide-paintbrush',
        label: 'Support',
      },
      {
        value: 'api',
        icon: 'i-lucide-cloud',
        label: 'API',
        disabled: true,
      },
    ],
    [
      {
        value: 'log-out',
        label: 'Log Out',
        icon: 'i-lucide-log-out',
        shortcut: '⇧⌘Q',
      },
    ],
  ]

  return (
    <div>
      <button {...api.getContextTriggerProps()}>
        <div>Open context menu</div>
      </button>
      {api.open && createPortal(
        <div data-layout="sinppets" {...api.getPositionerProps()}>
          <div>My Account</div>
          <div {...api.getSeparatorProps()} />
          {items.map((itemList, index) => (
            <ul key={index} {...api.getContentProps()}>
              {itemList.map(item => (
                <li key={item.value} {...api.getItemProps({ value: item.value, disabled: item?.disabled })}>
                  <div className={`${item.icon}`} />
                  {item.label}
                  {item.shortcut && (
                    <span>{item.shortcut}</span>
                  )}
                </li>
              ))}
              {index < items.length - 1 && (
                <div {...api.getSeparatorProps()} />
              )}
            </ul>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}
