<script lang="ts">
  import { routes } from '@destyler/shared'
  import {Link} from 'svelte-routing'
</script>

<div class="p-3">
  <h1 class="font-bold text-2xl mb-4">
    Destyler + Svelte
  </h1>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
    {#each routes as route}
      <Link
        class="p-2 border rounded-lg hover:shadow-md cursor-pointer transition-shadow text-center"
        to={route.path}
      >
        <h2 class="text-sm font-medium capitalize truncate">
          {route.label}
        </h2>
      </Link>
    {/each}
  </div>
</div>
