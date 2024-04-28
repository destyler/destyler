<script setup lang="ts">
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
</script>

<template>
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
    <CraftBox v-if="false" name="CollapseDemo">
      <CollapseDemo />
    </CraftBox>
    <CraftBox name="CollapsibleDemo" >
      <CollapsibleDemo />
    </CraftBox>
    <CraftBox name="ComboboxDemo" >
      <ComboboxDemo />
    </CraftBox>
    <CraftBox v-if="false" name="ContentMenuDemo" >
      <ContentMenuDemo />
    </CraftBox>
    <CraftBox name="CountdownDemo" >
      <CountdownDemo />
    </CraftBox>
    <CraftBox v-if="false" name="DialogDemo" >
      <DialogDemo />
    </CraftBox>
    <CraftBox name="DividerDemo" >
      <DividerDemo />
    </CraftBox>
    <CraftBox name="DraggableDemo" >
      <DraggableDemo />
    </CraftBox>
    <CraftBox v-if="false" name="DropdownDemo" >
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
  </Box>
</template>
