<script setup lang="ts">
import { ref } from 'vue'
import { DestylerRadioGroupIndicator, DestylerRadioGroupItem, DestylerRadioGroupRoot } from '../src'

const radioStateSingle = ref('default')
</script>

<template>
  <DestylerRadioGroupRoot
    v-model="radioStateSingle"
    :loop="false"
    class="flex flex-col gap-2.5"
    aria-label="View density"
    orientation="vertical"
  >
    <div class="flex items-center">
      <DestylerRadioGroupItem
        id="r1"
        aria-label="Default"
        class="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-dark focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default data-[disabled]:bg-red-500"
        value="default"
      >
        <DestylerRadioGroupIndicator
          class="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-green"
        />
      </DestylerRadioGroupItem>
      <label class="text-black text-[15px] leading-none pl-[15px]" for="r1">
        Default
      </label>
    </div>
    <div class="flex items-center">
      <DestylerRadioGroupItem
        id="r2"
        aria-label="Comfortable"
        class="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-dark focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default data-[disabled]:bg-red-500"
        value="comfortable"
      >
        <DestylerRadioGroupIndicator
          class="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-green"
        />
      </DestylerRadioGroupItem>
      <label class="text-black text-[15px] leading-none pl-[15px]" for="r2">
        Comfortable
      </label>
    </div>
    <div class="flex items-center">
      <DestylerRadioGroupItem
        id="r3"
        aria-label="Compact"
        as-child
        class="bg-black w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-dark focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
        value="compact"
      >
        <button>
          <DestylerRadioGroupIndicator
            class="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-green"
          />
        </button>
      </DestylerRadioGroupItem>
      <label class="text-black text-[15px] leading-none pl-[15px]" for="r3">
        Compact
      </label>
    </div>
  </DestylerRadioGroupRoot>
</template>
