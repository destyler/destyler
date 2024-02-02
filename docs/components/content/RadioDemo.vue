<script setup lang="ts">
import { DestylerIcon, DestylerLabel, DestylerRadioGroupIndicator, DestylerRadioGroupItem, DestylerRadioGroupRoot } from 'destyler'
</script>

<template>
  <DestylerRadioGroupRoot class="grid gap-2" default-value="country">
    <div class="flex items-center space-x-2">
      <DestylerRadioGroupItem value="country" class="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <DestylerRadioGroupIndicator class="flex items-center justify-center" if="for1">
          <DestylerIcon name="radix-icons:check" class="h-3.5 w-3.5 fill-primary" />
        </DestylerRadioGroupIndicator>
      </DestylerRadioGroupItem>
      <DestylerLabel html-for="foe1">
        Country
      </DestylerLabel>
    </div>
    <div class="flex items-center space-x-2">
      <DestylerRadioGroupItem value="channel" class="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <DestylerRadioGroupIndicator class="flex items-center justify-center" if="for2">
          <DestylerIcon name="radix-icons:check" class="h-3.5 w-3.5 fill-primary" />
        </DestylerRadioGroupIndicator>
      </DestylerRadioGroupItem>
      <DestylerLabel html-for="foe2">
        Channel X
      </DestylerLabel>
    </div>
    <div class="flex items-center space-x-2">
      <DestylerRadioGroupItem value="flylo" class="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <DestylerRadioGroupIndicator class="flex items-center justify-center" if="for3">
          <DestylerIcon name="radix-icons:check" class="h-3.5 w-3.5 fill-primary" />
        </DestylerRadioGroupIndicator>
      </DestylerRadioGroupItem>
      <DestylerLabel html-for="foe3">
        FlyLo
      </DestylerLabel>
    </div>
  </DestylerRadioGroupRoot>
</template>
