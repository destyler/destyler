<script lang="ts">
  import { routes } from '@destyler/shared-private'
</script>

<main class="h-screen p-4 flex">
  <div class="flex flex-col gap-4 w-48 border-r border-gray-200 pr-6">
    <div class="text-xl font-bold text-gray-800 sticky top-0 bg-white">
      <a href="/" class="cursor-pointer">
        Destyler
      </a>
    </div>
    <div class="flex flex-col space-y-2 overflow-y-auto">
      {#each routes as route}
        <a
          href={route.path}
          class="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-gray-600 hover:text-dark"
        >
          {route.label}
        </a>
      {/each}
    </div>
  </div>
  <div class="flex-1 pl-6 overflow-y-auto pr-80">
    <slot />
  </div>
</main>

<style>
a {
  text-decoration: none;
}

.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

</style>
