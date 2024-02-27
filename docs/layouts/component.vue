<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="bg-white dark:bg-black w-screen h-screen color-black dark:color-white overflow-x-hidden overflow-y-hidden">
    <Nav />
    <main class="flex-1">
      <div>
        <div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <Aside />
          <main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div class="mx-auto w-full min-w-0 overflow-y-auto h-screen middle-section">
              <Breadcrumb :items="route.path.split('/')" />
              <div class="mb-40">
                <slot />
              </div>
            </div>
            <Toc />
          </main>
        </div>
      </div>
    </main>
  </div>
</template>
