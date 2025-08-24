import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'

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
      <button
        {...api.getContextTriggerProps()}
        className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-primary/15 border-dashed hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-offset-2 text-sm cursor-default transition-colors"
      >
        <div className="text-primary">Open context menu</div>
      </button>
      {api.open && createPortal(
        <div
          {...api.getPositionerProps()}
          className="z-50! min-w-32 overflow-hidden rounded-md border border-border! w-56 bg-popover p-1 text-popover-foreground shadow-md outline-none! focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <div className="px-2 py-1.5 text-sm font-semibold text-primary">
            My Account
          </div>
          <div className="-mx-1 my-1 h-px bg-muted" {...api.getSeparatorProps()} />
          {items.map((itemList, index) => (
            <ul
              key={index}
              {...api.getContentProps()}
              className="group p-1 pb-0 last:pb-1 outline-none!"
            >
              {itemList.map(item => (
                <li
                  key={item.value}
                  {...api.getItemProps({ value: item.value, disabled: item?.disabled })}
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                >
                  <div className={`mr-2 h-4 w-4 ${item.icon}`} />
                  {item.label}
                  {item.shortcut && (
                    <span className="ml-auto text-xs tracking-widest opacity-60">
                      {item.shortcut}
                    </span>
                  )}
                </li>
              ))}
              {index < items.length - 1 && (
                <div className="-mx-1 my-1 h-px bg-muted" {...api.getSeparatorProps()} />
              )}
            </ul>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}
