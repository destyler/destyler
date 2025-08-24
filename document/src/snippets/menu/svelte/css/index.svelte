<script lang="ts">
  import * as menu from '@destyler/menu'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './index.css'

  interface MenuItem {
    value: string
    label: string
    icon: string
    shortcut?: string
    disabled?: boolean
  }

  const id = $props.id()

  const [state, send] = useMachine(menu.machine({
    id,
    'aria-label': 'File',
  }))

  const api = $derived(menu.connect(state, send, normalizeProps))

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
</script>

<div>
  <button
    {...api.getTriggerProps()}
    class="menu-trigger"
  >
    Open
  </button>

  {#if api.open}
    <div use:portal>
      <div
        {...api.getPositionerProps()}
        class="menu-positioner"
      >
        <div class="menu-title">
          My Account
        </div>
        <div class="menu-separator" {...api.getSeparatorProps()} ></div>
        
        {#each items as itemList, index}
          <ul {...api.getContentProps()} class="menu-content">
            {#each itemList as item}
              <li
                {...api.getItemProps({ value: item.value, disabled: item?.disabled })}
                class="menu-item"
              >
                <div class="menu-item-icon {item.icon}" ></div>
                {item.label}
                {#if item?.shortcut}
                  <span class="menu-item-shortcut">
                    {item.shortcut}
                  </span>
                {/if}
              </li>
            {/each}
            {#if index < items.length - 1}
              <div class="menu-separator" {...api.getSeparatorProps()} ></div>
            {/if}
          </ul>
        {/each}
      </div>
    </div>
    
  {/if}
</div>
