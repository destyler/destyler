<script lang="ts">
import { collapsibleControls } from '@destyler/shared-private'
import { useControls, Toolbar, StateVisualizer, Layout } from '@destyler/shared-private/svelte'
import { normalizeProps, useMachine } from '@destyler/svelte'
import * as collapse from '../../index'
import '../style.css'

const controls = useControls(collapsibleControls)

const id = $props.id();

const [state, send] = useMachine(collapse.machine({
  id,
}), {
  context: controls.context,
})

const api = $derived(collapse.connect(state, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <button {...api.getTriggerProps()}>
        Collapsible Trigger
      </button>
      <div {...api.getContentProps()}>
        <p>
          Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
          id est laborum.
          {' '}
          <span>Some Link</span>
        </p>
      </div>
    </div>
  </main>
  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
