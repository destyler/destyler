<script setup lang="ts">
import {ref} from 'vue'
import Box from './components/Box.vue'
import CraftBox from './components/CraftBox.vue'
import AspectRatioDemo from '@destyler/demo/aspectRadio/demos/AspectRadio.unocss.demo.vue'
import BackTopDemo from '@destyler/demo/backTop/demos/BackTop.demo.vue'
import BreadcrumbsDemo from '@destyler/demo/breadcrumbs/demos/Breadcrumbs.demo.vue'
import ButtonDemo from '@destyler/demo/button/demos/Button.demo.vue'
import CheckboxDemo from '@destyler/demo/checkbox/demos/Checkbox.demo.vue'
import CollapseDemo from '@destyler/demo/collapse/demos/Collapse.demo.vue'
import CollapsibleDemo from '@destyler/demo/collapsible/demos/Collapsible.demo.vue'
import ComboboxDemo from '@destyler/demo/combobox/demos/Combobox.demo.vue'
import ContentMenuDemo from '@destyler/demo/contextMenu/demos/ContentMenu.demo.vue'
import CountdownDemo from '@destyler/demo/countdown/demos/Countdown.demo.vue'
import DialogDemo from '@destyler/demo/dialog/demos/Dialog.unocss.demo.vue'
import DividerDemo from '@destyler/demo/divider/demos/Divider.demo.vue'
import DraggableDemo from '@destyler/demo/draggable/demos/Draggable.demo.vue'
import DropdownDemo from '@destyler/demo/dropdown/demos/Dropdown.demo.vue'
import DynamicDemo from '@destyler/demo/dynamic/demos/Dynamic.demo.vue'
import EllipsisDemo from '@destyler/demo/ellipsis/demos/Ellipsis.demo.vue'
import HoverCardDemo from '@destyler/demo/hoverCard/demos/HoverCard.demo.vue'
import ImageDemo from '@destyler/demo/image/demos/AvatarBasic.demo.vue'
import InfoDemo from '@destyler/demo/info/demos/Info.demo.vue'
import LabelDemo from '@destyler/demo/label/demos/Label.demo.vue'
import LinkDemo from '@destyler/demo/link/demos/Link.demo.vue'
import MenuDemo from '@destyler/demo/menu/demos/Menu.unocss.demo.vue'
import MenubarDemo from '@destyler/demo/menubar/demos/Menubar.unocss.demo.vue'
import ModalDemo from '@destyler/demo/modal/demos/Modal.demo.vue'
import NavigationDemo from '@destyler/demo/navigation/demos/Navigation.demo.vue'
import OtpInputDemo from '@destyler/demo/otpInput/demos/OtpInput.demo.vue'
import PaginationDemo from '@destyler/demo/pagination/demos/Pagination.demo.vue'
import PopoverDemo from '@destyler/demo/popover/demos/Popover.unocss.demo.vue'
import ProgressDemo from '@destyler/demo/progress/demos/Progress.demo.vue'
import RadioDemo from '@destyler/demo/radio/demos/Radio.demo.vue'
import RangeCalendarDemo from '@destyler/demo/rangeCalendar/demos/RangeCalendar.demo.vue'
import ScrollAreaDemo from '@destyler/demo/scrollArea/demos/ScrollArea.demo.vue'
import SelectDemo from '@destyler/demo/select/demos/Select.demo.vue'
import SliderDemo from '@destyler/demo/slider/demos/Slider.demo.vue'
import SplitterDemo from '@destyler/demo/splitter/demos/Splitter.demo.vue'
import SwitchDemo from '@destyler/demo/switch/demos/Switch.unocss.demo.vue'
import TabsDemo from '@destyler/demo/tabs/demos/Tabs.demo.vue'
import ToastDemo from '@destyler/demo/toast/demos/Toast.demo.vue'
import ToggleDemo from '@destyler/demo/toggle/demos/Toggle.demo.vue'
import ToolbarDemo from '@destyler/demo/toolbar/demos/Toolbar.unocss.demo.vue'
import TooltipDemo from '@destyler/demo/tooltip/demos/Tooltip.demo.vue'

const uwu = ref(false)
</script>

<template>
  <div v-if="uwu">
    <Box>
      <CraftBox name="AspectRatioDemo">
        <AspectRatioDemo />
      </CraftBox>
      <CraftBox name="BackTopDemo">
        <BackTopDemo />
      </CraftBox>
      <CraftBox name="BreadcrumbsDemo">
        <BreadcrumbsDemo />
      </CraftBox>
      <CraftBox name="ButtonDemo">
        <ButtonDemo />
      </CraftBox>
      <CraftBox name="CheckboxDemo" >
        <CheckboxDemo />
      </CraftBox>
      <CraftBox name="CollapseDemo">
        <CollapseDemo />
      </CraftBox>
      <CraftBox name="CollapsibleDemo" >
        <CollapsibleDemo />
      </CraftBox>
      <CraftBox name="ComboboxDemo" >
        <ComboboxDemo />
      </CraftBox>
      <CraftBox name="ContentMenuDemo" >
        <ContentMenuDemo />
      </CraftBox>
      <CraftBox name="CountdownDemo" >
        <CountdownDemo />
      </CraftBox>
      <CraftBox name="DialogDemo" >
        <DialogDemo />
      </CraftBox>
      <CraftBox name="DividerDemo" >
        <DividerDemo />
      </CraftBox>
      <CraftBox name="DraggableDemo" >
        <DraggableDemo />
      </CraftBox>
      <CraftBox name="DropdownDemo" >
        <DropdownDemo />
      </CraftBox>
      <CraftBox name="DynamicDemo" >
        <DynamicDemo />
      </CraftBox>
      <CraftBox name="EllipsisDemo" >
        <EllipsisDemo />
      </CraftBox>
      <CraftBox name="HoverCardDemo" >
        <HoverCardDemo />
      </CraftBox>
      <CraftBox name="ImageDemo" >
        <ImageDemo />
      </CraftBox>
      <CraftBox name="InfoDemo" >
        <InfoDemo />
      </CraftBox>
      <CraftBox name="LabelDemo" >
        <LabelDemo />
      </CraftBox>
      <CraftBox name="LinkDemo" >
        <LinkDemo />
      </CraftBox>
      <CraftBox name="MenuDemo" >
        <MenuDemo />
      </CraftBox>
      <CraftBox name="MenubarDemo" >
        <MenubarDemo />
      </CraftBox>
      <CraftBox name="ModalDemo" >
        <ModalDemo />
      </CraftBox>
      <CraftBox v-if="false" name="NavigationDemo" >
        <NavigationDemo />
      </CraftBox>
      <CraftBox name="OtpInputDemo" >
        <OtpInputDemo />
      </CraftBox>
      <CraftBox name="PaginationDemo" >
        <PaginationDemo />
      </CraftBox>
      <CraftBox name="PopoverDemo" >
        <PopoverDemo />
      </CraftBox>
      <CraftBox name="ProgressDemo" >
        <ProgressDemo />
      </CraftBox>
      <CraftBox name="RadioDemo" >
        <RadioDemo />
      </CraftBox>
      <CraftBox name="ScrollAreaDemo" >
        <ScrollAreaDemo />
      </CraftBox>
      <CraftBox name="SelectDemo" >
        <SelectDemo />
      </CraftBox>
      <CraftBox name="SliderDemo" >
        <SliderDemo />
      </CraftBox>
      <CraftBox name="SplitterDemo" >
        <SplitterDemo />
      </CraftBox>
      <CraftBox name="SwitchDemo" >
        <SwitchDemo />
      </CraftBox>
      <CraftBox v-if="false" name="ToastDemo" >
        <ToastDemo />
      </CraftBox>
      <CraftBox name="ToggleDemo" >
        <ToggleDemo />
      </CraftBox>
      <CraftBox name="ToolbarDemo" >
        <ToolbarDemo />
      </CraftBox>
      <CraftBox name="TooltipDemo" >
        <TooltipDemo />
      </CraftBox>

    </Box>
    <div class="mt-4">
      <CraftBox class="h-100!" name="RangeCalendarDemo" >
        <RangeCalendarDemo />
      </CraftBox>
      <CraftBox class="h-120!" name="TabsDemo" >
        <TabsDemo />
      </CraftBox>
    </div>
  </div>
  <div v-else>
    <LabelDemo />
  </div>
</template>
