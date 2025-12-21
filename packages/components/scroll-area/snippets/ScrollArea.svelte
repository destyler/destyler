<script lang="ts">
  import * as scrollArea from '@destyler/scroll-area'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`,
  )

  const id = $props.id()

  const [state, send] = useMachine(scrollArea.machine({ id }))

  const api = $derived(scrollArea.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getViewportProps()}>
    <div {...api.getContentProps()}>
      <div class="scroll-area-header">Tags</div>
      {#each tags as tag}
        <div class="scroll-area-item">
          {tag}
        </div>
      {/each}
    </div>
  </div>

  <div {...api.getScrollbarProps({ orientation: 'vertical' })}>
    <div {...api.getThumbProps({ orientation: 'vertical' })}></div>
  </div>

  <div {...api.getScrollbarProps({ orientation: 'horizontal' })}>
    <div {...api.getThumbProps({ orientation: 'horizontal' })}></div>
  </div>

  <div {...api.getCornerProps()}></div>
</div>
