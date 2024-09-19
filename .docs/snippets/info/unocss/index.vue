<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { InfoRoot } from '@destyler/info'
</script>

<template>
  <InfoRoot
    relative="~"
    w="70%"
    rounded="lg"
    border="~"
    p="x-4 y-3 [&>svg~*]:l-7"
    text="sm foreground [&>svg]:foreground"
    left="[&>svg]:4"
    top="[&>svg]:4"
    absolute="[&>svg]:~"
    translate="[&>svg+div]:y-[-3px] "
    bg="background"
  >
    <Icon
      name="carbon:home"
      w="4"
      h="4"
    />
    <h5
      m="b-1"
      font="medium"
      leading="none"
      tracking="tight"
    >
      Go Home
    </h5>
    <div
      text="sm"
      leading="[&_p]:relaxed"
    >
      Gee it's good to be back home
    </div>
  </InfoRoot>
</template>
