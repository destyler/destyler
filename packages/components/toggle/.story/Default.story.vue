<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import { Toggle } from '../src'

const toggleState = ref<boolean>(false)
const toggleStateOn = ref<boolean>(true)
const toggleStateDefaultOn = ref<boolean>()
const toggleStateDefaultOff = ref<boolean>()

function onChange() {
  // eslint-disable-next-line no-alert
  alert('On Change Event')
}
</script>

<template>
  <Story title="Toggle/Default" :layout="{ type: 'single', iframe: true }">
    <Variant title="chromatic">
      <div class="flex flex-col items-left dark:text-white">
        <h1 class="font-bold text-xl dark:text-white">
          Uncontrolled
        </h1>
        <span class="">default off</span>
        <Toggle
          v-model="toggleState"
          aria-label="Toggle bold"
          class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
        >
          <Icon name="radix-icons:font-bold" class="text-black" />
        </Toggle>
        <span class="">default on</span>
        <Toggle
          v-model="toggleStateOn"
          :default-value="true"
          aria-label="Toggle bold"
          class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
        >
          <Icon name="radix-icons:font-bold" class="text-black" />
        </Toggle>

        <h1 class="font-bold text-xl dark:text-white">
          Controlled
        </h1>
        <span class="">default off</span>
        <Toggle
          v-model="toggleStateDefaultOff"
          aria-label="Toggle bold"
          :default-value="false"
          class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
        >
          <Icon name="radix-icons:font-bold" class="text-black" />
        </Toggle>

        <span class="">default on</span>
        <Toggle
          v-model="toggleStateDefaultOn"
          aria-label="Toggle bold"
          :default-value="true"
          class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
        >
          <Icon name="radix-icons:font-bold" class="text-black" />
        </Toggle>

        <h1 class="font-bold text-xl dark:text-white">
          Events
        </h1>
        <span class="">@update:pressed</span>
        <Toggle
          v-model="toggleState"
          aria-label="Toggle bold"
          class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
          @update:pressed="onChange"
        >
          <Icon name="radix-icons:font-bold" class="text-black" />
        </Toggle>
      </div>
    </Variant>
    <Variant title="default">
      <Toggle
        v-model="toggleState"
        aria-label="Toggle bold"
        class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
      >
        <Icon name="radix-icons:font-bold" class="text-black" />
      </Toggle>
    </Variant>
    <Variant title="toggled by default">
      <Toggle
        v-model="toggleStateDefaultOn"
        aria-label="Toggle bold"
        :default-value="true"
        class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
      >
        <Icon name="radix-icons:font-bold" class="text-black" />
      </Toggle>
    </Variant>
    <Variant title="onPressedChange Event">
      <Toggle
        v-model="toggleState"
        aria-label="Toggle bold"
        class="hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 shadow-blackA7 flex h-[35px] w-[35px] items-center justify-center rounded bg-white text-base leading-4 shadow-[0_2px_10px] focus-within:shadow-[0_0_0_2px] focus-within:shadow-black"
        @update:pressed="onChange"
      >
        <Icon name="radix-icons:font-bold" class="text-black" />
      </Toggle>
    </Variant>
  </Story>
</template>
