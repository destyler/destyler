<script setup lang="ts">
import { DestylerLabel } from '@destyler/label/src/label'

const route = useRoute()

const { data } = await useAsyncData(`content-${route.path}`, () => {
  return queryContent().where({ _path: route.path }).findOne()
})
</script>

<template>
  <div class="hidden text-sm xl:block">
    <div class="sticky top-16 -mt-10 pt-4">
      <div class="relative overflow-hidden pb-10">
        <div class="h-full w-full rounded-[inherit]">
          <div style="min-width: 100%; display: table;">
            <div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
              <div class="space-y-2">
                <p class="font-medium">
                  <DestylerLabel>On This Page</DestylerLabel>
                </p>
                <ul class="m-0 list-none">
                  <li v-for="toc in data?.body?.toc?.links" :key="toc.id" class="mt-0 pt-2">
                    <NuxtLink
                      class="inline-block no-underline transition-colors text-#09090b dark:text-#fafafa"
                      :class="{
                        'text-op-100!': `#${toc.id}` === route.hash,
                        'text-op-60! hover:text-op-80!': `#${toc.id}` !== route.hash,
                      }"
                      :to="`#${toc.id}`"
                    >
                      {{ toc.text }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
