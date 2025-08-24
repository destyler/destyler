/** @jsxImportSource solid-js */
import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import './index.css'

interface MenuItem {
  value: string
  label: string
  icon: string
  shortcut?: string
  disabled?: boolean
}

export default function Menu() {

  const [state, send] = useMachine(menu.machine({
    'id': createUniqueId(),
    'aria-label': 'File',
  }))
  const api = createMemo(() => menu.connect(state, send, normalizeProps))

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
      <button
        {...api().getTriggerProps()}
        class="menu-trigger"
      >
        Open
      </button>
      {api().open && (
        <Portal>
          <div
            {...api().getPositionerProps()}
            class="menu-positioner"
          >
            <div class="menu-title">
              My Account
            </div>
            <div class="menu-separator" {...api().getSeparatorProps()} />
            {items.map((itemList, index) => (
              <ul
                {...api().getContentProps()}
                class="menu-content"
              >
                {itemList.map(item => (
                  <li
                    {...api().getItemProps({ value: item.value, disabled: item?.disabled })}
                    class="menu-item"
                  >
                    <div class={`menu-item-icon ${item.icon}`} />
                    {item.label}
                    {item.shortcut && (
                      <span class="menu-item-shortcut">
                        {item.shortcut}
                      </span>
                    )}
                  </li>
                ))}
                {index < items.length - 1 && (
                  <div class="menu-separator" {...api().getSeparatorProps()} />
                )}
              </ul>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}
