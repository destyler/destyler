<script setup lang="ts">
import MenubarDemo from '@destyler/demo/menubar/demos/Menubar.unocss.demo.vue'
import { MenuDemo } from '@destyler/demo/menu/demos/Menu.demo.ts'
</script>

<template>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <MenuDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <MenubarDemo />
    </div>
  </div>
</template>
