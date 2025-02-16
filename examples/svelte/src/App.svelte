<script lang="ts">
  import DefaultLayout from './layouts/Default.svelte';
  import { Route, Router } from 'svelte-routing'
  import { router } from './router/index.svelte'

</script>

<main>
  <Router>
    <DefaultLayout>
      {#each router as { path, component }}
        <Route {path}>
          <svelte:component this={component} />
        </Route>
      {/each}
    </DefaultLayout>
  </Router>
</main>

