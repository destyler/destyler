<script setup lang="ts">
import { ref } from 'vue'
import { OtpInput, OtpInputRoot } from '..'

const value = ref<string[]>([])
</script>

<template>
  <Story title="Otp Input/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <div>
        <label for="otp">Input label</label>

        <OtpInputRoot
          id="otp"
          v-model="value"
          class="flex gap-2 items-center"
          @complete="e => console.log(e.join(''))"
        >
          <OtpInput
            v-for="(id, index) in 5"
            :key="id"
            class="w-10 h-10 rounded text-center text-green10 placeholder:text-mauve5"
            :index="index"
          />
        </OtpInputRoot>
      </div>
    </Variant>
  </Story>
</template>
