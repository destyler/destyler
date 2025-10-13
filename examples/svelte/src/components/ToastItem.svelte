<script lang="ts">
  import { normalizeProps, useActor } from "@destyler/svelte"
  import * as toast from "@destyler/toast"

  interface Props {
    actor: toast.Service
  }

  const { actor }: Props = $props()

  const [snapshot, send] = useActor(actor)
  const api = $derived(toast.connect(snapshot, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getGhostBeforeProps()}></div>
  <p {...api.getTitleProps()}>{api.title}</p>
  <p {...api.getDescriptionProps()}>{api.description}</p>
  <button {...api.getCloseTriggerProps()}>
    <div class="i-carbon-close"></div>
  </button>
  <div {...api.getGhostAfterProps()}></div>
</div>
