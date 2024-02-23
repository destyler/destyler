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
import DialogCssDemo from '@destyler/demo/dialog/demos/Dialog.unocss.demo.vue'
import DropdownDemo from '@destyler/demo/dropdown/demos/Dropdown.demo.vue'
import ContentMenuDemo from '@destyler/demo/contextMenu/demos/ContentMenu.demo.vue'
import HoverCardDemo from '@destyler/demo/hoverCard/demos/HoverCard.demo.vue'
import NavigationDemo from '@destyler/demo/navigation/demos/Navigation.demo.vue'
import ToastDemo from '@destyler/demo/toast/demos/Toast.demo.vue'
import PaginationDemo from '@destyler/demo/pagination/demos/Pagination.demo.vue'
import ComboboxDemo from '@destyler/demo/combobox/demos/Combobox.demo.vue'
import ComboboxLongDemo from '@destyler/demo/combobox/demos/Combobox.long.demo.vue'
import BreadcrumbsDemo from '@destyler/demo/breadcrumbs/demos/Breadcrumbs.demo.vue'
import DynamicDemo from '@destyler/demo/dynamic/demos/Dynamic.demo.vue'

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
  </div> -->
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <DynamicDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <BreadcrumbsDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <BreadcrumbsDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <BreadcrumbsDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <ComboboxDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <ComboboxLongDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <PaginationDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <NavigationDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <MenubarDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <DialogCssDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <DropdownDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <ContentMenuDemo />
    </div>
  </div>
  <div class="h-80 mt-4 w-full border flex items-center justify-center overflow-hidden relative select-none rounded-xl border-solid border-#ededed dark:border-[#282828] [background:#f8f8f8] dark:[background:#1c1c1c] box-border">
    <div class="w-full h-full flex items-center justify-center touch-none box-border">
      <HoverCardDemo />
    </div>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <ToastDemo />
    </div>
  </div>
  <!-- <TabsDemo /> -->
</template>
