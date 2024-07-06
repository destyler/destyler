<script setup lang="ts">
import {ref} from 'vue'
import Box from './components/Box.vue'
import CraftBox from './components/CraftBox.vue'
import AspectRatioDemo from '~/components/aspectRadio/demos/AspectRadio.unocss.demo.vue'
import BackTopDemo from '~/components/backTop/demos/BackTop.demo.vue'
import BreadcrumbsDemo from '~/components/breadcrumbs/demos/Breadcrumbs.demo.vue'
import CalendarDemo from '~/components/calendar/demos/Calendar.demo.vue'
import ButtonDemo from '~/components/button/demos/Button.demo.vue'
import CheckboxDemo from '~/components/checkbox/demos/Checkbox.demo.vue'
import CollapseDemo from '~/components/collapse/demos/Collapse.demo.vue'
import CollapsibleDemo from '~/components/collapsible/demos/Collapsible.demo.vue'
import ComboboxDemo from '~/components/combobox/demos/Combobox.demo.vue'
import ContentMenuDemo from '~/components/contextMenu/demos/ContentMenu.demo.vue'
import CountdownDemo from '~/components/countdown/demos/Countdown.demo.vue'
import DialogDemo from '~/components/dialog/demos/Dialog.unocss.demo.vue'
import DividerDemo from '~/components/divider/demos/Divider.demo.vue'
import DraggableDemo from '~/components/draggable/demos/Draggable.demo.vue'
import DropdownDemo from '~/components/dropdown/demos/Dropdown.demo.vue'
import DynamicDemo from '~/components/dynamic/demos/Dynamic.demo.vue'
import EllipsisDemo from '~/components/ellipsis/demos/Ellipsis.demo.vue'
import HoverCardDemo from '~/components/hoverCard/demos/HoverCard.demo.vue'
import ImageDemo from '~/components/image/demos/AvatarBasic.demo.vue'
import InfoDemo from '~/components/info/demos/Info.demo.vue'
import LabelDemo from '~/components/label/demos/Label.demo.vue'
import LinkDemo from '~/components/link/demos/Link.demo.vue'
import MenuDemo from '~/components/menu/demos/Menu.unocss.demo.vue'
import MenubarDemo from '~/components/menubar/demos/Menubar.unocss.demo.vue'
import ModalDemo from '~/components/modal/demos/Modal.demo.vue'
import NavigationDemo from '~/components/navigation/demos/Navigation.demo.vue'
import OtpInputDemo from '~/components/otpInput/demos/OtpInput.demo.vue'
import PaginationDemo from '~/components/pagination/demos/Pagination.demo.vue'
import PopoverDemo from '~/components/popover/demos/Popover.unocss.demo.vue'
import ProgressDemo from '~/components/progress/demos/Progress.demo.vue'
import RadioDemo from '~/components/radio/demos/Radio.demo.vue'
import RangeCalendarDemo from '~/components/rangeCalendar/demos/RangeCalendar.demo.vue'
import ScrollAreaDemo from '~/components/scrollArea/demos/ScrollArea.demo.vue'
import SelectDemo from '~/components/select/demos/Select.demo.vue'
import SliderDemo from '~/components/slider/demos/Slider.demo.vue'
import SplitterDemo from '~/components/splitter/demos/Splitter.demo.vue'
import SwitchDemo from '~/components/switch/demos/Switch.unocss.demo.vue'
import TabsDemo from '~/components/tabs/demos/Tabs.demo.vue'
import ToastDemo from '~/components/toast/demos/Toast.demo.vue'
import ToggleDemo from '~/components/toggle/demos/Toggle.demo.vue'
import ToolbarDemo from '~/components/toolbar/demos/Toolbar.unocss.demo.vue'
import TooltipDemo from '~/components/tooltip/demos/Tooltip.demo.vue'

const uwu = ref(true)
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
      <CraftBox v-if="false" name="SelectDemo" >
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
      <CraftBox class="h-100!" name="CalendarDemo" >
        <CalendarDemo />
      </CraftBox>
      <CraftBox class="h-100!" name="RangeCalendarDemo" >
        <RangeCalendarDemo />
      </CraftBox>
      <CraftBox class="h-120!" name="TabsDemo" >
        <TabsDemo />
      </CraftBox>
    </div>
  </div>
  <div v-else>
    <RadioDemo/>
  </div>
</template>
