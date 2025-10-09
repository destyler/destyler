<script lang="ts">
  import * as tabs from '@destyler/tabs'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import Account from './Account.svelte'
  import Password from './Password.svelte'
  import './style.css'

  const data = [
    { value: 'account', label: 'Account', component: Account },
    { value: 'password', label: 'Password', component: Password },
  ]

  const id = $props.id()
  const [state, send] = useMachine(tabs.machine({ id, value: 'account' }))
  const api = $derived(tabs.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getListProps()}>
    {#each data as item}
      <button {...api.getTriggerProps({ value: item.value })}>
        {item.label}
      </button>
    {/each}
  </div>
  {#each data as item}
    <div {...api.getContentProps({ value: item.value })}>
      <p class="text-sm text-muted-foreground">
        {#if item.component}
          <item.component />
        {/if}
      </p>
    </div>
  {/each}
</div>
