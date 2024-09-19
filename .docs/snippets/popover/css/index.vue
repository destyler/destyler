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
import './style.css'

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
      class="popover-trigger"
    >
      Open popover
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        class="popover-content"
      >
        <div class="box">
          <div class="space-y-2">
            <h4 class="title">
              Dimensions
            </h4>
            <p class="desc">
              Set the dimensions for the layer.
            </p>
          </div>
          <div class="item-box">
            <div
              v-for="form in forms"
              :key="form.label"
              class="item"
            >
              <Label
                for="width"
                class="label"
              >
                {{ form.label }}
              </Label>
              <input
                v-model="form.value"
                class="input"
              >
            </div>
          </div>
        </div>
        <PopoverClose
          class="popover-close"
        >
          <Icon name="carbon:close-large" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
