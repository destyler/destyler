<script lang="ts">
import * as separator from '../../index'
import { normalizeProps, useMachine } from '@destyler/svelte'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
import '../style.css'

const items = [
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
]

const id = $props.id()

const [state, send] = useMachine(separator.machine({ id }))
const api = $derived(separator.connect(state, send, normalizeProps))
</script>

<Layout>
  <section class="separator-example">
    <header class="separator-example__header">
      <p class="separator-example__title">Destyler UI</p>
      <p class="separator-example__subtitle">Unstyled components for Svelte.</p>
    </header>

    <div class="separator-line separator-example__divider" {...api.getRootProps()}></div>

    <nav class="separator-example__nav" aria-label="Secondary">
      {#each items as item, index}
        <span class="separator-example__nav-item">{item.label}</span>
        {#if index < items.length - 1}
          <div
            class="separator-line separator-example__divider--vertical"
            {...api.getRootProps('vertical')}
          ></div>
        {/if}
      {/each}
    </nav>
  </section>

  <Toolbar viz>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
