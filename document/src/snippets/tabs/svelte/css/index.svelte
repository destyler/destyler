<script lang="ts">
  import * as tabs from '@destyler/tabs'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import Account from './Account.svelte'
  import Password from './Password.svelte'

  const data = [
    { value: 'account', label: 'Account', component: Account },
    { value: 'password', label: 'Password', component: Password },
  ]

  const id = $props.id()
  const [state, send] = useMachine(tabs.machine({ id, value: 'account' }))
  const api = $derived(tabs.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="tabs-root">
  <div
    {...api.getListProps()}
    class="tabs-list"
  >
    {#each data as item}
      <button
        {...api.getTriggerProps({ value: item.value })}
        class="tabs-trigger"
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#each data as item}
    <div
      {...api.getContentProps({ value: item.value })}
      class="tabs-content"
    >
      <item.component />
    </div>
  {/each}
</div>
