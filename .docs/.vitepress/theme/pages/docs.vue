<script setup lang="ts">
</script>

<template>
  <main class="min-h-[calc(100vh-var(--header-height))]">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
        <div class="lg:col-span-2">
          <Aside />
        </div>
        <div class="lg:col-span-8">
          <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
            <div class="lg:col-span-8">
              <article class="article prose mt-4">
                <Breadcrumb />
                <Content class="prose Doc m-auto" />
                <Line class="my-12!" />
                <Page />
              </article>
            </div>
            <div class="lg:col-span-2 order-first lg:order-last">
              <nav class="sticky top-[--header-height] bg-background backdrop-blur -mx-4 sm:-mx-6 px-4 sm:px-6 lg:px-4 lg:-mx-4 overflow-y-auto max-h-[calc(100vh-var(--header-height))]">
                <div class="py-3 lg:py-8 lg:border-0 space-y-3">
                  <Toc />
                  <Line />
                  <Package />
                  <Line />
                  <Community />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
