<script lang="ts">
  import * as otpInput from "@destyler/otp-input";
  import { normalizeProps, useMachine } from "@destyler/svelte";

  const id = $props.id();

  const [state, send] = useMachine(otpInput.machine({
    id,
    otp: true,
    placeholder: '',
  }));

  const api = $derived(otpInput.connect(state, send, normalizeProps));
</script>

<div class="otp-container">
  <div class="otp-inner-container">
    <div class="otp-input-group">
      <div
        {...api.getRootProps()}
        class="otp-root"
      >
        {#each Array(6) as _, index}
          <input
            {...api.getInputProps({ index })}
            class="otp-input"
          />
        {/each}
      </div>
    </div>

    <div class="otp-button-container">
      <button
        class="otp-clear-button"
        onclick={api.clearValue}
      >
        <span>clear</span>
      </button>
    </div>
  </div>
</div>

<style>
  @import './index.css';
</style>
