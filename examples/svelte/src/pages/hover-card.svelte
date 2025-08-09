<script lang="ts">
  import * as hoverCard from "@destyler/hover-card";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { hoverCardControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/hover-card.css'

  const controls = useControls(hoverCardControls);

  const id = $props.id();

  const [state, send] = useMachine(hoverCard.machine({ id }), {
    context: controls.context
  });

  const api = $derived(hoverCard.connect(state, send, normalizeProps));
</script>

<div class="hover-card-root">
  <span data-testid="hover-card-test-click">click</span>
  <a
    href="https://twitter.com/elonehoo"
    target="_blank"
    {...api.getTriggerProps()}
    class="hover-card-trigger"
  >
    Twitter
  </a>
  <div {...api.getPositionerProps()}>
    <div
      {...api.getContentProps()}
      class="hover-card-content"
    >
      <div>
        <img
          src="https://github.com/elonehoo.png"
          alt="Profile"
          class="hover-card-avatar"
        />
        <div>
          <h3>elonehoo</h3>
          <p>Frontend Developer</p>
        </div>
      </div>
      <div>
        Follow me on Twitter for web development tips and updates!
      </div>
      <div >
        @elonehoo
      </div>
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
