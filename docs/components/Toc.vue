<script setup lang="ts">
import { DestylerDivider, DestylerLabel } from 'destyler'

const route = useRoute()

const { data } = await useAsyncData(`content-${route.path}`, () => {
  return queryContent().where({ _path: route.path }).findOne()
})
</script>

<template>
  <div class="hidden text-sm xl:block">
    <div class="sticky -mt-10 pt-8">
      <div class="relative overflow-hidden pb-10">
        <div class="h-full w-full rounded-[inherit]">
          <div class="table min-w-full">
            <div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
              <div class="space-y-2">
                <p class="font-medium">
                  <DestylerLabel>On This Page</DestylerLabel>
                </p>
                <TocItem :toc-list="data?.body?.toc?.links" />
              </div>
              <DestylerDivider class="shrink-0 bg-#E4E4E7 dark:bg-#27272A data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-2/3 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
              <div class="space-y-2 mt-2">
                <p class="font-medium">
                  <DestylerLabel>Packages</DestylerLabel>
                </p>
                <Packages />
              </div>
              <DestylerDivider class="shrink-0 bg-#E4E4E7 dark:bg-#27272A data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-2/3 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
              <div class="space-y-2 mt-2">
                <p class="font-medium">
                  <DestylerLabel>Community</DestylerLabel>
                </p>
                <Community />
              </div>
              <Top />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
