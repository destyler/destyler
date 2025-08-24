/** @jsxImportSource solid-js */
import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'

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
        class="ml-4 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary! text-primary-foreground! hover:bg-primary/90! h-10 px-4 py-2 outline-none!"
      >
        Open
      </button>
      {api().open && (
        <Portal>
          <div
            {...api().getPositionerProps()}
            class="z-50! min-w-32 overflow-hidden rounded-md border border-border! w-56 bg-popover p-1 text-popover-foreground shadow-md outline-none! focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <div class="px-2 py-1.5 text-sm font-semibold text-primary">
              My Account
            </div>
            <div class="-mx-1 my-1 h-px bg-muted" {...api().getSeparatorProps()} />
            {items.map((itemList, index) => (
              <ul
                {...api().getContentProps()}
                class="group p-1 pb-0 last:pb-1 outline-none!"
              >
                {itemList.map(item => (
                  <li
                    {...api().getItemProps({ value: item.value, disabled: item?.disabled })}
                    class="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                  >
                    <div class={`mr-2 h-4 w-4 ${item.icon}`} />
                    {item.label}
                    {item.shortcut && (
                      <span class="ml-auto text-xs tracking-widest opacity-60">
                        {item.shortcut}
                      </span>
                    )}
                  </li>
                ))}
                {index < items.length - 1 && (
                  <div class="-mx-1 my-1 h-px bg-muted" {...api().getSeparatorProps()} />
                )}
              </ul>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}
