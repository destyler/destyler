<script lang="ts">
  import * as otpInput from "@destyler/otp-input";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { pinInputControls } from '@destyler/shared';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(pinInputControls);

  const id = $props.id();

  const [state, send] = useMachine(otpInput.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(otpInput.connect(state, send, normalizeProps));
</script>

<div class="flex flex-col p-4">
  <div class="w-full max-w-md space-y-8">
    <div class="text-center">
      <h2 class="mt-6 text-3xl font-bold tracking-tight text-black dark:text-white">
        Verification Code
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Please enter the 3-digit code you received
      </p>
    </div>

    <div
      {...api.getRootProps()}
      class="flex justify-center gap-4 mt-8"
    >
      {#each Array(3) as _, index}
        <input
          {...api.getInputProps({ index })}
          class="w-16 h-16 text-center text-2xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
        />
      {/each}
    </div>

    <div class="text-center mt-6">
      <button
        on:click={api.clearValue()}
        class="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
      >
        Clear
      </button>
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
