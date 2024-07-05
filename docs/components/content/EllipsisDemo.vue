<script setup lang="ts">
import { EllipsisContent, EllipsisPortal, EllipsisProvider, EllipsisRoot, EllipsisTrigger } from 'destyler'
</script>

<template>
  <EllipsisProvider>
    <EllipsisRoot>
      <EllipsisTrigger class="max-w-240px cursor-default">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam
      </EllipsisTrigger>
      <EllipsisPortal>
        <EllipsisContent
          v-slot="{ text }"
          as-child
          :side-offset="5"
          class="z-50 overflow-hidden rounded-md bg-#18181B dark:bg-#FAFAFA px-3 py-1.5 text-xs text-#FAFAFA dark:text-#18181B "
        >
          <p>
            {{ text }}
          </p>
        </EllipsisContent>
      </EllipsisPortal>
    </EllipsisRoot>
  </EllipsisProvider>
</template>
