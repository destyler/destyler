<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="bg-white dark:bg-black w-screen h-screen color-black dark:color-white overflow-x-hidden">
    <Nav />
    <main class="flex-1">
      <div>
        <div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <Aside />
          <main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div class="mx-auto w-full min-w-0">
              <Breadcrumb :items="route.path.split('/')" />
              <slot />
            </div>
            <Toc />
          </main>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.\[\&\>h3\]\:step>h3 {
  counter-increment: step
}

.\[\&\>h3\]\:step>h3:before {
  position: absolute;
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border-width: 4px;
  border-color: white;
  background-color: #F4F4F5;
  text-align: center;
  text-indent: -1px;
  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  margin-left: -50px;
  margin-top: -4px;
  content: counter(step)
}
.dark .\[\&\>h3\]\:step>h3:before{
  border-color: #09090B;
  background-color: #27272A;
}
</style>
