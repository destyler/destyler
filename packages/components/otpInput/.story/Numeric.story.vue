<script setup lang="ts">
import { ref } from 'vue'
import { OtpInput, OtpInputRoot } from '../src'

const value = ref<string[]>([])
</script>

<template>
  <Story title="Otp Input/Numeric" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <OtpInputRoot
        v-model="value"
        class="flex gap-2 items-center"
        type="number"
        :otp="true"
        @complete="e => console.log(e.join(''))"
      >
        <OtpInput
          v-for="(id, index) in 5"
          :key="id"
          class="w-10 h-10 rounded text-center text-green10 placeholder:text-mauve5"
          :index="index"
        />
      </OtpInputRoot>
    </Variant>
  </Story>
</template>
