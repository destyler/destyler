<script lang="ts">
  import * as signaturePad from "@destyler/signature"
  import { useMachine, normalizeProps } from "@destyler/svelte"
  import { signatureControls } from '@destyler/shared-private'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(signatureControls)

  const id = $props.id()
  const [state, send] = useMachine(signaturePad.machine({ id }), {
    context: controls.context,
  })

  const api = $derived(signaturePad.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="max-w-2xl p-6">
  <label {...api.getLabelProps()} class="block text-lg font-medium text-gray-700 mb-2">
    Signature
  </label>

  <div
    {...api.getControlProps()}
    class="w-[400px] h-[200px] relative border-2 border-gray-300 rounded-lg bg-white shadow-sm"
  >
    <svg {...api.getSegmentProps()} class="w-full h-full">
      {#each api.paths as path, i}
        <path
          {...api.getSegmentPathProps({ path })}
          class="stroke-black"
        />
      {/each}
      {#if api.currentPath}
        <path
          {...api.getSegmentPathProps({ path: api.currentPath })}
          class="stroke-black"
        />
      {/if}
    </svg>

    <button
      {...api.getClearTriggerProps()}
      class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      <span class="text-gray-600 i-carbon:close-large"></span>
    </button>

    <div
      {...api.getGuideProps()}
      class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-400"
    ></div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
