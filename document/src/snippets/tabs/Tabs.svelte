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

<div {...api.getRootProps()} class="w-full mt-0!">
  <div
    {...api.getListProps()}
    class="inline-flex h-10 w-full items-center justify-center rounded-md
    bg-muted p-1 text-muted-foreground"
  >
    {#each data as item}
      <button
        {...api.getTriggerProps({ value: item.value })}
        class="inline-flex items-center justify-center whitespace-nowrap w-1/2
        rounded-sm px-3 py-2 text-sm font-medium ring-offset-background
        transition-all focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2 mt-0!
        disabled:pointer-events-none disabled:opacity-50
        data-[selected]:bg-background data-[selected]:text-foreground
        data-[selected]:shadow-sm"
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#each data as item}
    <div
      {...api.getContentProps({ value: item.value })}
      class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[hidden]:hidden"
    >
      <p class="text-sm text-muted-foreground">
        {#if item.component}
          <item.component />
        {/if}
      </p>
    </div>
  {/each}
</div>
