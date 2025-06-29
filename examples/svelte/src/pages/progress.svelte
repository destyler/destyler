<script lang="ts">
  import * as progress from "@destyler/progress";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { progressControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(progressControls);

  const id = $props.id();

  const [state, send] = useMachine(progress.machine({ id, value: 30 }), {
    context: controls.context,
  });

  const api = $derived(progress.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="max-w-md p-6">
  <div {...api.getLabelProps()} class="text-lg font-semibold mb-2 text-gray-800">
    Upload progress
  </div>
  <div
    {...api.getTrackProps()}
    class="w-full h-4 bg-gray-200 rounded-full overflow-hidden"
  >
    <div
      {...api.getRangeProps()}
      class="h-full bg-black transition-all duration-300 ease-out rounded-full"
    >
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
