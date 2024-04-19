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
    <CraftBox name="CollapsibleDemo" >
      <CollapsibleDemo />
    </CraftBox>
    <CraftBox v-if="false" name="CollapseDemo">
      <CollapseDemo />
    </CraftBox>
  </Box>
</template>
