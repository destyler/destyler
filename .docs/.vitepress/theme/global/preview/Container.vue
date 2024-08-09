<script setup lang="ts">
withDefaults(
  defineProps<{
    overflow?: boolean
    folder?: string
    files?: string[]
    cssFramework?: string
  }>(),
  { folder: '', files: () => [] },
)
</script>

<template>
  <div class="relative text-[15px] text-black mt-8">
    <div
      class="vp-raw border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] p-4 rounded-t-lg w-full relative items-center justify-center flex"
      :class="{ 'overflow-x-auto': overflow }"
    >
      <div class="w-full max-w-[700px] flex items-center py-12 sm:py-[100px] justify-center ">
        <slot name="default" />
      </div>
    </div>
    <slot name="code" />
  </div>
</template>

<style scoped>
:deep(li) {
  margin-top: 0 !important;
}

:deep(button:focus),
:deep(button:focus-visible) {
  outline: 0;
}

:deep(h3) {
  margin: 0px !important;
  font-weight: unset !important;
}

:deep(pre) {
  z-index: 0 !important;
}
</style>
