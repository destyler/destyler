<script lang="ts">
  import * as otpInput from "@destyler/otp-input";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { pinInputControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/otp-input.css'

  const controls = useControls(pinInputControls);

  const id = $props.id();

  const [state, send] = useMachine(otpInput.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(otpInput.connect(state, send, normalizeProps));
</script>

<input data-testid="copy-text" />
<div class="otp-input-box">
  <div class="otp-input-content-box">
    <div>
      <h2>
        Verification Code
      </h2>
      <p>
        Please enter the 3-digit code you received
      </p>
    </div>
    <div
      {...api.getRootProps()}
      class="otp-input-root"
    >
      {#each [1,2,3] as index}
        <input
          data-testid={`input-${index}`}
          {...api.getInputProps({ index: index - 1 })}
          class="otp-input-item-input"
        />
      {/each}
    </div>
    <div>
      <button
        data-testid="clear"
        onclick={()=>{
          api.clearValue()
        }}
      >
        Clear
      </button>
      <button
        data-testid="focus"
        onclick={()=>{
          api.focus()
        }}
      >
        Focus
      </button>
    </div>
  </div>
</div>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
