<script lang="ts">
  import * as aspectRatio from '@destyler/aspect-ratio'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  
  const uid = $props.id();
  
  const [state, send] = useMachine(aspectRatio.machine({
    id: uid,
    ratio: 16 / 9,
  }))
  const api = $derived(aspectRatio.connect(state, send, normalizeProps))
  </script>
  
  <main>
    <div class="w-full! sm:w-75! overflow-hidden! rounded-md!">
      <div {...api.getRootProps()}>
        <div {...api.getContentProps()}>
          <img 
            class="h-full! w-full! object-cover!" 
            src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
          />
        </div>
      </div>
    </div>
  </main>
  