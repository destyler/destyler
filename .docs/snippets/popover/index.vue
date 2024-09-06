<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { Label } from '@destyler/label'
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@destyler/popover'

const forms = ref([
  {
    label: 'Width',
    value: '100%',
  },
  {
    label: 'Max. width',
    value: '100px',
  },
  {
    label: 'Height',
    value: '25px',
  },
  {
    label: 'Max. height',
    value: 'none',
  },
])
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      class="
      inline-flex items-center justify-center whitespace-nowrap
      rounded-md text-sm font-medium transition-colors
      shadow h-9 px-4 py-2
      focus-visible:outline-none focus-visible:ring-1
      disabled:pointer-events-none disabled:opacity-50
      bg-primary hover:bg-primary/90 text-primary-foreground
      "
    >
      Open popover
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        class="
        z-50 w-80 rounded-md border border-border
        bg-popover p-4 text-popover-foreground
        shadow-md outline-none
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2
        "
      >
        <div class="grid gap-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">
              Dimensions
            </h4>
            <p class="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div class="grid gap-2">
            <div
              v-for="form in forms"
              :key="form.label"
              class="grid grid-cols-3 items-center gap-4"
            >
              <Label
                for="width"
                class="text-sm text-black dark:text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:op-70"
              >
                {{ form.label }}
              </Label>
              <input
                v-model="form.value"
                class="flex col-span-2 h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
            </div>
          </div>
        </div>
        <PopoverClose
          class="
          inline-flex items-center justify-center whitespace-nowrap
          rounded-full text-sm font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:pointer-events-none
          disabled:opacity-50 border border-input bg-background
          shadow-sm hover:bg-accent hover:text-accent-foreground
          h-25px w-25px cursor-pointer absolute top-10px right-10px
          "
        >
          <Icon name="carbon:close-large" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
