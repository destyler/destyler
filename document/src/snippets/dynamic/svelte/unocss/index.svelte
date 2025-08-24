<script lang="ts">
  import * as dynamic from "@destyler/dynamic";
  import { normalizeProps, useMachine } from "@destyler/svelte";


  const [state, send] = useMachine(
    dynamic.machine({
      id: crypto.randomUUID(),
      value: ["Svelte", "Vue"],
    }),
  );

  const api = $derived(dynamic.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="w-md p-6">
  <div class="flex flex-wrap gap-2 mb-4">
    {#each api.value as value, index (index)}
      <span {...api.getItemProps({ index, value })} class="relative group">
        <div
          {...api.getItemPreviewProps({ index, value })}
          class="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm border border-px border-input"
        >
          <span class="text-sm font-medium">{value}</span>
          <button
            {...api.getItemDeleteTriggerProps({ index, value })}
            class="i-carbon:close inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/50 hover:bg-primary transition-colors text-xs"
          >
          </button>
        </div>
        <input
          {...api.getItemInputProps({ index, value })}
          class="hidden absolute left-0 top-0 w-full px-2 py-1.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
        />
      </span>
    {/each}
  </div>
  <div class="relative">
    <input
      placeholder="Add Tag..."
      {...api.getInputProps()}
      class="w-full px-4 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-primary outline-none bg-background text-foreground placeholder-muted-foreground"
    />
  </div>
</div>
