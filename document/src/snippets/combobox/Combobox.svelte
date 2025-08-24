<script lang="ts">
  import * as combobox from '@destyler/combobox'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'

  const comboboxData = [
    { label: 'Vue', code: 'vue' },
    { label: 'React', code: 'react' },
    { label: 'Svelte', code: 'svelte' },
    { label: 'Solid', code: 'solid' },
    { label: 'Nuxt', code: 'nuxt' },
    { label: 'Next', code: 'next' },
    { label: 'Svelte Kit', code: 'svelte-kit' },
  ]

  let options = comboboxData

  const collection = combobox.collection({
    items: comboboxData,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  })

  const [state, send] = useMachine(
    combobox.machine({
      id: crypto.randomUUID(),
      collection,
      onOpenChange() {
        options = comboboxData
      },
      onInputValueChange({ inputValue }) {
        const filtered = comboboxData.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
        options = filtered.length > 0 ? filtered : comboboxData
      },
      placeholder: 'Select a framework',
    }),
  )

  const api = $derived(combobox.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="w-full outline-none! mt-0!">
  <div {...api.getControlProps()} class="relative outline-none!">
    <input
      {...api.getInputProps()}
      class="flex h-10 w-full rounded-md border border-primary/20 text-primary
      bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground
      disabled:cursor-not-allowed disabled:opacity-50 outline-none!"
    >
    <button
      {...api.getTriggerProps()}
      class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground focus:outline-none"
    >
      <div class="i-carbon:chevron-down h-4 w-4 opacity-50 group-data-[state=open]:rotate--180 transition-transform duration-300" ></div>
    </button>
  </div>
  {#if api.open}
    <div use:portal>
      <div
        {...api.getPositionerProps()}
        class="relative mt-2"
      >
        {#if options.length > 0}
          <ul
            {...api.getContentProps()}
            class="absolute top-0 z-50 px-1 py-1 w-full min-w-[200px] overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            {#each options as item (item.code)}
              <li
                {...api.getItemProps({ item })}
                class="relative flex cursor-default select-none
                items-center rounded-sm px-2 py-1.5 text-sm outline-none
                data-[highlighted]:bg-accent
                data-[highlighted]:text-accent-foreground"
              >
                {item.label}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>

  {/if}
</div>
