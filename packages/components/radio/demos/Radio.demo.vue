<script setup lang="ts">
import {Icon} from '@destyler/icon'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot,Radio } from '../src/component'
</script>

<template>
  <RadioGroupRoot class="grid gap-2" default-value="country">
    <div class="flex items-center space-x-2">
      <RadioGroupItem value="country" class="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <RadioGroupIndicator class="flex items-center justify-center" if="for1">
          <Icon name="radix-icons:check" class="h-3.5 w-3.5 fill-primary" />
        </RadioGroupIndicator>
      </RadioGroupItem>
      <label html-for="foe1">
        Country
      </label>
    </div>
    <div class="flex items-center space-x-2">
      <RadioGroupItem value="channel" class="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <RadioGroupIndicator class="flex items-center justify-center" if="for2">
          <Icon name="radix-icons:check" class="h-3.5 w-3.5 fill-primary" />
        </RadioGroupIndicator>
      </RadioGroupItem>
      <label html-for="foe2">
        Channel X
      </label>
    </div>
    <div class="flex items-center space-x-2">
      <RadioGroupItem value="flylo" class="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <RadioGroupIndicator class="flex items-center justify-center" if="for3">
          <Icon name="radix-icons:check" class="h-3.5 w-3.5 fill-primary" />
        </RadioGroupIndicator>
      </RadioGroupItem>
      <label html-for="foe3">
        FlyLo
      </label>
    </div>
  </RadioGroupRoot>
  <div>
    <Radio
      id="r1"
      aria-label="Default"
      value="true"
      name="test"
    />
    <label for="r1">
      Default
    </label>
  </div>
</template>
