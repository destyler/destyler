<script lang="ts">
  import * as combobox from '@destyler/combobox'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './style.css'

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

<div {...api.getRootProps()}>
  <div {...api.getControlProps()}>
    <input {...api.getInputProps()}>
    <button {...api.getTriggerProps()}>
      <div ></div>
    </button>
  </div>
  {#if api.open}
    <div data-layout="sinppets" use:portal>
      <div {...api.getPositionerProps()}>
        {#if options.length > 0}
          <ul {...api.getContentProps()}>
            {#each options as item (item.code)}
              <li {...api.getItemProps({ item })} >
                {item.label}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>

  {/if}
</div>
