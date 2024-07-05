<script setup lang="ts">
import { ref } from 'vue'

import {
  SwitchRoot,
  SwitchThump,
} from '../src'

const checked = ref(false)
</script>

<template>
  <SwitchRoot
    v-model:checked="checked"
    class="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-#ffffff dark:focus-visible:ring-offset-#09090B disabled:cursor-not-allowed disabled:opacity-50 dark:data-[state=checked]:bg-#FAFAFA data-[state=checked]:bg-#18181B dark:data-[state=unchecked]:bg-#27272A data-[state=unchecked]:bg-#E4E4E7"
  >
    <SwitchThump class="pointer-events-none block h-4 w-4 rounded-full bg-#ffffff dark:bg-#09090B shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
  </SwitchRoot>
</template>
