<script lang="ts">
  import * as pagination from '../../index'
  import {paginationControls} from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(paginationControls)

  const id = $props.id()

  const [state, send] = useMachine(pagination.machine({
    id,
    count: 1000,
  }),{
    context: controls.context,
  })

  const api = $derived(pagination.connect(state, send, normalizeProps))
</script>

<Layout>
  <main>
    <nav {...api.getRootProps()}>
      <ul style="display: flex;">
        <li>
          <a {...api.getPrevTriggerProps()}>
            ⬅️
          </a>
        </li>
        {#each api.pages as page, i}
          <li>
            {#if page.type === 'page'}
              <a {...api.getItemProps(page)}>
                {page.value}
              </a>
            {:else}
              <span {...api.getEllipsisProps({ index: i })}>&#8230;</span>
            {/if}
          </li>
        {/each}
        <li>
          <a {...api.getNextTriggerProps()}>
            ➡️
          </a>
        </li>
      </ul>
    </nav>
  </main>
  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
