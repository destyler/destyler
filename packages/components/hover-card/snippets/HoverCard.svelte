<script lang="ts">
  import * as hoverCard from '@destyler/hover-card'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(hoverCard.machine({ id }))

  const api = $derived(hoverCard.connect(state, send, normalizeProps))
</script>

<div class=" mt-0!">
  <a
    href="https://twitter.com/elonehoo"
    target="_blank"
    {...api.getTriggerProps()}
  >
    Hover
  </a>

  {#if api.open}
    <div use:portal>
      <div {...api.getPositionerProps()} data-layout="sinppets">
        <div {...api.getContentProps()}>
          <div>
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
            />
            <div>
              <h4>elonehoo</h4>
              <p>Frontend Developer</p>
            </div>
          </div>
          <div>
            I hope every sunny afternoon can be wasted.
          </div>
          <div>
            <div></div>
            @elonehoo
          </div>
        </div>
      </div>
    </div>

  {/if}
</div>
