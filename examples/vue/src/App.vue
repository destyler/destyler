<script setup lang="ts">
import MenubarDemo from '@destyler/demo/menubar/demos/Menubar.unocss.demo.vue'
import { MenuDemo } from '@destyler/demo/menu/demos/Menu.demo.ts'
import MenuCssDemo from '@destyler/demo/menu/demos/Menu.unocss.demo.vue'
import PopperDemo from '@destyler/demo/popper/demos/Popper.demo.vue'
import ToolbarDemo from '@destyler/demo/toolbar/demos/Toolbar.unocss.demo.vue'
import ScrollAreaDemo from '@destyler/demo/scrollArea/demos/ScrollArea.demo.vue'
import TabsDemo from '@destyler/demo/tabs/demos/Tabs.demo.vue'
import BackTopDemo from '@destyler/demo/backTop/demos/BackTop.demo.vue'
import ButtonDemo from '@destyler/demo/button/demos/Button.demo.vue'
import CheckboxDemo from '@destyler/demo/checkbox/demos/Checkbox.demo.vue'
import CollapsibleDemo from '@destyler/demo/collapsible/demos/Collapsible.demo.vue'
import CollapseDemo from '@destyler/demo/collapse/demos/Collapse.demo.vue'
import SwitchDemo from '@destyler/demo/switch/demos/Switch.unocss.demo.vue'

// import { DestylerPrimitive } from '@destyler/primitive'
// import { useCustomElement, useForwardExpose } from '@destyler/composition'
// import { onMounted } from 'vue'

// const { forwardRef, currentRef, currentElement } = useForwardExpose()
// // const { customElement: forwardRef, currentElement } = useCustomElement()

// function handleClick() {

// }

// onMounted(() => {
//   console.info(currentElement)
// })
</script>

<template>
  <!-- <DestylerPrimitive ref="forwardRef" as="button" @click="handleClick">
    button
  </DestylerPrimitive> -->
  <!-- <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <MenuDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <MenubarDemo />
    </div>
  </div> -->
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <MenubarDemo />
    </div>
  </div>
  <!-- <TabsDemo /> -->
</template>
