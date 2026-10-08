<script lang="ts">
  import { portal } from '../../src/utils/portal'

  let { initiallyDisabled = false, container }: { initiallyDisabled?: boolean, container: HTMLElement } = $props()
  let disabled = $state(initiallyDisabled)

  export function setDisabled(next: boolean) {
    disabled = next
  }
</script>

<section data-origin>
  <i data-before></i>
  <span data-portal use:portal={{ disabled, container }}>content</span>
  <b data-after></b>
</section>
