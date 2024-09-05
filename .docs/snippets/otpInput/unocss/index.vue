<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  OtpInput,
  OtpInputRoot,
} from '@destyler/otp-input'

const value = ref<string[]>([])
</script>

<template>
  <OtpInputRoot
    v-model="value"
    flex="~"
    items="center"
    gap="2"
    op="has-[:disabled]:50"
  >
    <div
      flex="~"
      items="center"
    >
      <OtpInput
        v-for="(id, index) in 3"
        :key="id"
        :index="index"
        bg="#F8F8F8 dark:#1C1C1C"
        text="dark dark:light center sm"
        relative="~"
        focus="outline-none ring-2 ring-ring relative z-10"
        flex="~"
        h="10"
        w="10"
        items="center"
        justify="center"
        border="y r input"
        transition="all"
        first="rounded-l-md border-l"
      />
    </div>
    <div role="separator">
      <Icon name="carbon:dot-mark" text="primary" />
    </div>
    <div
      flex="~"
      items="center"
    >
      <OtpInput
        v-for="(id, index) in 3"
        :key="id"
        :index="index + 3"
        bg="#F8F8F8 dark:#1C1C1C"
        text="dark dark:light center sm"
        relative="~"
        focus="outline-none ring-2 ring-ring relative z-10"
        flex="~"
        h="10"
        w="10"
        items="center"
        justify="center"
        border="y r input"
        transition="all"
        first="rounded-l-md border-l"
      />
    </div>
  </OtpInputRoot>
</template>
