<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { InfoClose, InfoRoot } from '../src'
</script>

<template>
  <Story title="Info/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <InfoRoot class="relative w-full rounded-lg border border-green11 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-green11 [&>svg~*]:pl-7 bg-white text-green11 ">
        <Icon name="i-carbon-home" class="w-4 h-4" />
        <h5 class="mb-1 font-medium leading-none tracking-tight">
          Go Home
        </h5>
        <div class="text-sm [&_p]:leading-relaxed">
          Gee it's good to be back home
        </div>
        <InfoClose>
          <Icon name="i-carbon-close" class="w-4 h-4" />
        </InfoClose>
      </InfoRoot>
    </Variant>
  </Story>
</template>
