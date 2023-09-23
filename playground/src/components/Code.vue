<script setup lang="ts">
</script>

<template>
  <div>
    <div w="full" flex="~" border="b-1 b-solid black">
      <div w="1/2" class="text-center" border="r-1 r-solid black">
        unstyle
      </div>
      <div w="1/2" class="text-center">
        style
      </div>
    </div>
    <div w="full" h="screen" flex="~">
      <div
        w="1/2"
        border="r-1 r-solid black"
        flex="~"
        justify-center
        items-center
      >
        <div>
          <slot name="unstyle" />
        </div>
      </div>
      <div
        w="1/2"
        border="r-1 r-solid black"
        flex="~"
        justify-center
        items-center
      >
        <div>
          <slot name="style" />
        </div>
      </div>
    </div>
  </div>
</template>
